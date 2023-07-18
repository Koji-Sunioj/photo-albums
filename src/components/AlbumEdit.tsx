import Form from "react-bootstrap/Form";
import { TAlbumEditProps } from "../utils/types";

import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/esm/Button";

const AlbumEdit = ({
  setEditMode,
  setCreateFlow,
  startOver,
  editMode,
}: TAlbumEditProps) => {
  return (
    <>
      <h2>Your gallery</h2>
      <Form.Group className="mb-3">
        <Form.Check
          checked={editMode}
          label="edit mode"
          onChange={(e) => {
            const { checked } = e.currentTarget;
            setEditMode(checked);
          }}
        />
      </Form.Group>
      <Stack gap={3} direction="horizontal" className="mb-3">
        <Button
          variant="primary"
          onClick={() => {
            setCreateFlow("submit");
          }}
        >
          Next
        </Button>
        <Button variant="primary" onClick={startOver}>
          Start over
        </Button>
      </Stack>
    </>
  );
};

export default AlbumEdit;
