import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { TAlbumSubmitProps } from "../utils/types";
import { TAppState, AppDispatch } from "../utils/types";

import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/esm/Button";
import InputGroup from "react-bootstrap/InputGroup";

const AlbumSubmit = ({
  tags,
  title,
  setTags,
  setTitle,
  checkTitle,
  setCreateFlow,
  pushTag,
  tagRef,
  titleRef,
  sendAlbum,
}: TAlbumSubmitProps) => {
  const {
    album: { data, error, loading, message, mutateState },
  } = useSelector((state: TAppState) => state);

  const isCreatedOrUpdated =
    (data !== null && mutateState === "created") ||
    (data !== null && mutateState === "updated");

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
      {isCreatedOrUpdated && <Alert variant={"success"}>{message}</Alert>}
    </>
  );
};

export default AlbumSubmit;
