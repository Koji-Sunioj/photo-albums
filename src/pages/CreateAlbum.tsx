import { useState, useEffect } from "react";
import { fileMapper } from "../utils/mappers";
import { useSelector, useDispatch } from "react-redux";
import { resetAlbum } from "../redux/reducers/albumSlice";
import { TPhotoFile, TAppState, AppDispatch } from "../utils/types";

import AlbumEdit from "../components/AlbumEdit";
import AlbumForm from "../components/AlbumForm";
import AlbumSubmit from "../components/AlbumSubmit";
import UploadCarousel from "../components/UploadCarousel";

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const CreateAlbum = () => {
  const [index, setIndex] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [title, setTitle] = useState<string>("");
  const [editMode, setEditMode] = useState(false);
  const [createFlow, setCreateFlow] = useState("upload");
  const [previews, setPreviews] = useState<TPhotoFile[]>([]);

  const dispatch = useDispatch<AppDispatch>();
  const { mutateState } = useSelector((state: TAppState) => state.album);

  useEffect(() => {
    if (mutateState !== "idle") {
      setTimeout(() => {
        dispatch(resetAlbum());
      }, 2000);
    }
  });

  const previewMapping = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    const tenFiles = Array.from([...files!].slice(0, 10)).map(fileMapper);
    setPreviews(tenFiles);
    setCreateFlow("edit");
  };

  const deletePicture = (file: TPhotoFile) => {
    const { type, name } = file;
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

  const shouldCarousel = createFlow === "edit" && previews.length > 0;

  return (
    <>
      <Row>
        <Col lg={4}>
          {createFlow === "upload" && (
            <AlbumForm previewMapping={previewMapping} />
          )}
          {createFlow === "submit" && (
            <AlbumSubmit
              tags={tags}
              title={title}
              previews={previews}
              setTags={setTags}
              setTitle={setTitle}
              setCreateFlow={setCreateFlow}
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
