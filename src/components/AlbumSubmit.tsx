import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/esm/Button";
import InputGroup from "react-bootstrap/InputGroup";

import { useNavigate } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createAlbum } from "../redux/reducers/albumSlice";
import { resetAlbums } from "../redux/reducers/albumsSlice";

import { TAppState, AppDispatch } from "../utils/types";
import { TAlbumSubmitProps } from "../utils/types";

const AlbumSubmit = ({
  tags,
  title,
  previews,
  setTags,
  setTitle,
  setCreateFlow,
}: TAlbumSubmitProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    album: { data, error, loading, message, mutateState },
    auth: { userName, AccessToken },
  } = useSelector((state: TAppState) => state);

  const isCreated = data !== null && mutateState === "created";

  useEffect(() => {
    if (mutateState === "created" && data !== null) {
      dispatch(resetAlbums());
      setTimeout(() => {
        navigate("/albums/" + data.albumId);
      }, 2000);
    }
  });

  const tagRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const pushTag = (tag: string) => {
    if (tag.length > 0 && !tags.includes(tag) && tags.length < 5) {
      const tagCopy = [...tags];
      tagCopy.push(tag);
      setTags(tagCopy);
      tagRef.current!.value = "";
    }
  };

  const sendAlbum = () => {
    if (AccessToken !== null && userName !== null) {
      const newAlbum = {
        tags: tags,
        title: title,
        previews: previews,
        userName: userName,
        AccessToken: AccessToken,
      };
      dispatch(createAlbum(newAlbum));
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

  return (
    <>
      <h2>Your gallery</h2>
      <fieldset disabled={loading || mutateState === "created" || error}>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            defaultValue={title}
            placeholder="Album title"
            name="title"
            ref={titleRef}
            onKeyUp={() => {
              setTitle(titleRef.current!.value);
            }}
            onKeyDown={checkTitle}
          />
        </Form.Group>
        <InputGroup className="mb-3">
          <Button
            variant="primary"
            onClick={() => {
              if (tagRef.current !== null) {
                const {
                  current: { value: tag },
                } = tagRef;
                pushTag(tag);
              }
            }}
          >
            Add tag
          </Button>
          <Form.Control
            type="text"
            placeholder="nature, photography, family..."
            name="tags"
            ref={tagRef}
            onKeyDown={(e) => {
              if (e.key === "Enter" && tagRef.current !== null) {
                const {
                  current: { value: tag },
                } = tagRef;
                pushTag(tag);
              }
            }}
          />
        </InputGroup>
        <Stack gap={3} direction="horizontal" className="mb-3">
          <Button variant="primary" onClick={sendAlbum}>
            Submit
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setCreateFlow("edit");
            }}
          >
            Go back
          </Button>
        </Stack>
      </fieldset>
      {tags.length > 0 && (
        <div className="mb-3">
          <p>Your tags:</p>
          <Stack direction="horizontal" gap={3} className="mb-3">
            {tags.map((tag) => (
              <Button
                key={tag}
                variant="info"
                onClick={() => {
                  const filtered = tags.filter((item: string) => item !== tag);
                  setTags(filtered);
                }}
              >
                {tag}
              </Button>
            ))}
          </Stack>
        </div>
      )}
      {error && <Alert variant={"danger"}>{message}</Alert>}
      {loading && <Alert variant={"info"}>{message}</Alert>}
      {isCreated && <Alert variant={"success"}>{message}</Alert>}
    </>
  );
};

export default AlbumSubmit;
