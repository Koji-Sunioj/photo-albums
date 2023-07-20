import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import {
  fetchAlbum,
  patchAlbum,
  resetAlbum,
  createAlbum,
} from "../redux/reducers/albumSlice";
import {
  TPhotoFile,
  TAppState,
  AppDispatch,
  TAlbum,
  TPhoto,
} from "../utils/types";
import { fileMapper } from "../utils/mappers";
import { resetAlbums } from "../redux/reducers/albumsSlice";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import AlbumEdit from "../components/AlbumEdit";
import AlbumForm from "../components/AlbumForm";
import AlbumSubmit from "../components/AlbumSubmit";
import UploadCarousel from "../components/UploadCarousel";

const CreateAlbum = ({ task }: { task: string }) => {
  const navigate = useNavigate();
  const { albumId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const {
    album: { mutateState, data, loading, error },
    auth,
  } = useSelector((state: TAppState) => state);
  const isNotFetched = task === "edit" && !loading && !error;
  const shouldFetch =
    (isNotFetched && data !== null && data.albumId !== albumId) ||
    (isNotFetched && data === null);

  const [index, setIndex] = useState(0);
  const [mutateS3, setMutateS3] = useState<TPhotoFile[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [editMode, setEditMode] = useState(false);
  const [createFlow, setCreateFlow] = useState("upload");
  const [previews, setPreviews] = useState<TPhotoFile[]>([]);

  const tagRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mutateState !== "idle" && task === "create") {
      setTimeout(() => {
        dispatch(resetAlbum());
      }, 2000);
    }
    if (shouldFetch) {
      dispatch(fetchAlbum(albumId!));
      console.log("fetching");
    }
    if (!shouldFetch && data !== null && previews.length === 0) {
      createMapFromFetch(data);
      console.log("mapping existing photos");
    }

    if (mutateState === "updated" && data !== null) {
      setTimeout(() => {
        dispatch(resetAlbum());
        dispatch(resetAlbums());
        navigate("/albums/" + data.albumId);
      }, 2000);
    }

    if (mutateState === "created" && data !== null) {
      dispatch(resetAlbums());
      setTimeout(() => {
        navigate("/albums/" + data.albumId);
      }, 2000);
    }
  });

  const createMapFromFetch = (album: TAlbum) => {
    const { albumId, tags, title } = album;
    const fetchedPreviews: TPhotoFile[] = album.photos.map((item: TPhoto) => {
      const temp = {
        name: item.url.split(`${albumId}/`)[1].replace(/%20/g, " "),
        type: "s3Object",
        file: null,
        blob: item.url,
        closed: item.text === null,
        text: item.text,
        order: item.order,
      };
      return temp;
    });
    setTags(tags);
    setTitle(title);
    setPreviews(fetchedPreviews);
  };

  const previewMapping = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    const fileMax = task === "edit" ? 10 - previews.length : 10;
    const uploadedFiles = Array.from([...files!].slice(0, fileMax)).map(
      fileMapper(0)
    );
    switch (task) {
      case "edit":
        const possibleDups = previews.map((preview) => preview.name);
        const withoutDups = Array.from(files!).filter(
          (file) => !possibleDups.includes(file.name)
        );
        const previewMapped = Array.from(withoutDups).map(
          fileMapper(previews.length)
        );
        const joinedPhotos = previews.concat(previewMapped);
        setPreviews(joinedPhotos);
        break;
      case "create":
        setPreviews(uploadedFiles);
        break;
    }
    setCreateFlow("edit");
  };

  const deletePicture = (file: TPhotoFile) => {
    const { type, name } = file;
    if (type === "s3Object") {
      const s3delete = [...mutateS3];
      s3delete.push(file);
      setMutateS3(s3delete);
    }
    const copy = [...previews!];
    const filtered = copy.filter((item) => item.name !== name);
    if (filtered.length === 0) {
      startOver();
    } else {
      filtered.forEach((item, n) => (item.order = n + 1));
      setPreviews(filtered);
      setIndex(0);
    }
  };

  const reOrder = (order: number, position: string) => {
    const found = previews.find((item) => item.order === order);
    const filtered = previews.filter((item) => item.order !== order);
    const trueIndex = found!.order - 1;
    let sideStep = position === "front" ? trueIndex - 1 : trueIndex + 1;
    filtered.splice(sideStep, 0, found!);

    filtered.forEach((item, n) => (item.order = n + 1));
    setIndex(sideStep);
    setPreviews(filtered);
  };

  const mutateCopy = (
    newValue: string | boolean,
    file: TPhotoFile,
    attribute: string
  ) => {
    const copy = [...previews!];
    const index = copy.findIndex((item) => item.name === file.name);
    const editTarget = copy[index];
    const newValues: { [index: string]: string | boolean } = {};
    newValues[attribute] = newValue;
    Object.assign(editTarget, newValues);
    copy[index] = editTarget;
    if (attribute === "closed" && typeof newValue == "boolean") {
      copy[index].text = null;
    }
    setPreviews(copy);
  };

  const startOver = () => {
    setPreviews([]);
    setCreateFlow("upload");
    setEditMode(false);
    setIndex(0);
  };

  const pushTag = (tag: string) => {
    if (tag.length > 0 && !tags.includes(tag) && tags.length < 5) {
      const tagCopy = [...tags];
      tagCopy.push(tag);
      setTags(tagCopy);
      tagRef.current!.value = "";
    }
  };

  const checkTitle = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const properLength = event.currentTarget.value.length > 0;
    const entered = event.key === "Enter";
    if (entered && properLength) {
      sendAlbum();
      event.preventDefault();
    }
  };

  const sendAlbum = () => {
    const { AccessToken, userName } = auth;
    if (AccessToken !== null && userName !== null) {
      switch (task) {
        case "create":
          const newAlbum = {
            tags: tags,
            title: title,
            previews: previews,
            userName: userName,
            AccessToken: AccessToken,
          };
          dispatch(createAlbum(newAlbum));
          break;
        case "edit":
          const existingAlbum = {
            tags: tags,
            title: title,
            previews: previews,
            userName: userName,
            AccessToken: AccessToken,
            albumId: albumId!,
            mutateS3: mutateS3,
          };
          dispatch(patchAlbum(existingAlbum));
          break;
      }
    }
  };

  const shouldCarousel = createFlow === "edit" && previews.length > 0;

  return (
    <>
      <Row>
        <Col lg={4}>
          {createFlow === "upload" && (
            <AlbumForm
              previewMapping={previewMapping}
              task={task}
              setCreateFlow={setCreateFlow}
            />
          )}

          {createFlow === "submit" && (
            <AlbumSubmit
              tags={tags}
              title={title}
              setTags={setTags}
              setTitle={setTitle}
              setCreateFlow={setCreateFlow}
              pushTag={pushTag}
              tagRef={tagRef}
              titleRef={titleRef}
              checkTitle={checkTitle}
              sendAlbum={sendAlbum}
            />
          )}
          {shouldCarousel && (
            <AlbumEdit
              editMode={editMode}
              setEditMode={setEditMode}
              setCreateFlow={setCreateFlow}
              startOver={startOver}
            />
          )}
        </Col>
      </Row>
      {shouldCarousel && (
        <UploadCarousel
          index={index}
          previews={previews}
          editMode={editMode}
          setIndex={setIndex}
          reOrder={reOrder}
          mutateCopy={mutateCopy}
          deletePicture={deletePicture}
        />
      )}
    </>
  );
};

export default CreateAlbum;
