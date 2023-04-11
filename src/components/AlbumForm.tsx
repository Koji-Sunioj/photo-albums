import { TAlbumFormProps } from "../utils/types";

import Form from "react-bootstrap/Form";

const AlbumForm = ({ previewMapping }: TAlbumFormProps) => {
  return (
    <>
      <h2>Upload images to a new album</h2>
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
        </Form.Group>
      </Form>
    </>
  );
};

export default AlbumForm;
