import { useSelector } from "react-redux";
import { AlbumQueryProps, StateProps } from "../utils/types";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/esm/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Collapse from "react-bootstrap/esm/Collapse";

const AlbumQuery = ({
  filter,
  mutateParams,
  createQuery,
}: // queryRef,
AlbumQueryProps) => {
  const { type, sort, direction } = filter;

  const {
    albums: { pages, tags },
    // filter: { type },
    filterToggle: { filterDisplay },
  } = useSelector((state: StateProps) => state);

  return (
    <Collapse in={filterDisplay}>
      <div>
        <Row>
          <Col lg={3} className="mb-2">
            <Form.Label>Filter type</Form.Label>
            <div
              style={{
                padding: "0.375rem 0.75rem",
                border: "1px solid #ced4da",
                borderRadius: "8px",
              }}
            >
              <div>
                <Form.Check
                  inline
                  label="Free text"
                  name="queryFilter"
                  type="radio"
                  checked={type === "text"}
                  onChange={() => {
                    mutateParams({ type: "text" }, "radio");
                  }}
                />
                <Form.Check
                  inline
                  label="Tags"
                  name="tagsFilter"
                  type="radio"
                  checked={type === "tags"}
                  onChange={() => {
                    mutateParams({ type: "tags" }, "radio");
                  }}
                />
              </div>
            </div>
          </Col>
          <Col lg={3} className="mb-2">
            <Form onSubmit={createQuery}>
              <Form.Label>Search</Form.Label>
              <InputGroup>
                <Button
                  // ref={queryRef}

                  type="submit"
                >
                  Go
                </Button>
                {type === "text" && (
                  <Form.Control
                    name="filter"
                    id="filter"
                    type="text"
                    placeholder="nature, israel, photography..."
                  />
                )}
                {type === "tags" && (
                  <>
                    <Form.Control
                      name="filter"
                      id="filter"
                      type="text"
                      placeholder="nature, israel, photography..."
                      list="tags"
                    />
                    <datalist id="tags">
                      {tags !== null &&
                        tags.map((tag) => {
                          let option = null;
                          option = <option value={tag} key={tag} />;
                          return option;
                        })}
                    </datalist>
                  </>
                )}
              </InputGroup>
            </Form>
          </Col>
          <Col lg={3} className="mb-2">
            <Form.Label>Sort by</Form.Label>
            <Form.Select
              value={sort}
              onChange={(event) => {
                const {
                  currentTarget: { value },
                } = event;
                mutateParams({ sort: value });
              }}
            >
              {["created", "title", "userName"].map((field) => (
                <option key={field} value={field}>
                  {field.toLocaleLowerCase()}
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col lg={3} className="mb-2">
            <Form.Label>Direction</Form.Label>
            <Form.Select
              value={direction}
              onChange={(event) => {
                const {
                  currentTarget: { value },
                } = event;
                mutateParams({ direction: value });
              }}
            >
              {["descending", "ascending"].map((field) => (
                <option key={field} value={field}>
                  {field.toLocaleLowerCase()}
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>
      </div>
    </Collapse>
  );
};

export default AlbumQuery;
