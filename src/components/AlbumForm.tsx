import { useNavigate } from "react-router-dom";

import { TAlbumFormProps } from "../utils/types";

import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";

const AlbumForm = ({
  previewMapping,
  task,
  setCreateFlow,
}: TAlbumFormProps) => {
  const navigate = useNavigate();
  const directions =
    task === "edit"
      ? "Add images to your existing album"
      : "Upload images to a new album";

  return (
    <>
      <h2>{directions}</h2>
      <Form encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label>Upload your files (max 10)</Form.Label>
          <Form.Control
            onChange={previewMapping}
            id="fileInput"
            type="file"
            name="upload"
            accept="image/*"
            multiple
          />
          {task === "edit" && (
            <Form.Text className="text-muted">
              Images which already exist in your album will be ignored
            </Form.Text>
          )}
        </Form.Group>
        {task === "edit" && (
          <Stack direction="horizontal" gap={3}>
            <Button
              onClick={() => {
                navigate(-1);
              }}
            >
              Go back
            </Button>
            <Button
              onClick={() => {
                setCreateFlow("edit");
              }}
            >
              Next
            </Button>
          </Stack>
        )}
      </Form>
    </>
  );
};

export default AlbumForm;
