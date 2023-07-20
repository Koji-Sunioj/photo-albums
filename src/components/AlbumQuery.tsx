import { useSelector } from "react-redux";

import { TAlbumQueryProps, TAppState } from "../utils/types";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/esm/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Collapse from "react-bootstrap/esm/Collapse";

const AlbumQuery = ({
  filter,
  loading,
  queryRef,
  mutateParams,
  createQuery,
  searchDisable,
  checkTags,
  removeTags,
  changeSelect,
}: TAlbumQueryProps) => {
  const { type, sort, direction, query } = filter;

  const {
    albums: { tags },
    filterToggle: { filterDisplay },
  } = useSelector((state: TAppState) => state);

  const shouldDisabled =
    (type === "text" && !filter.hasOwnProperty("query")) || type === "tags";

  return (
    <Collapse in={filterDisplay}>
      <div>
        <fieldset disabled={loading}>
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
                    ref={queryRef}
                    type="submit"
                    disabled={shouldDisabled}
                  >
                    Go
                  </Button>
                  {type === "text" && (
                    <Form.Control
                      name="filter"
                      id="filter"
                      type="text"
                      defaultValue={query}
                      placeholder="nature, israel, photography..."
                      onInput={searchDisable}
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
                        onChange={checkTags}
                      />
                      <datalist id="tags">
                        {tags !== null &&
                          tags
                            .filter((tag) => {
                              return !query?.split(",").includes(tag);
                            })
                            .map((tag) => {
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
              <Form.Select name="sort" value={sort} onChange={changeSelect}>
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
                name="direction"
                onChange={changeSelect}
              >
                {["descending", "ascending"].map((field) => (
                  <option key={field} value={field}>
                    {field.toLocaleLowerCase()}
                  </option>
                ))}
              </Form.Select>
            </Col>
          </Row>{" "}
        </fieldset>
        {type === "tags" && query !== undefined && query!.length > 0 && (
          <Row className="mb-2">
            <Col>
              {query!.split(",").map((tag) => (
                <Button
                  variant="info"
                  key={tag}
                  style={{ margin: "3px" }}
                  onClick={() => {
                    removeTags(tag);
                  }}
                >
                  {tag}
                </Button>
              ))}
            </Col>
          </Row>
        )}
      </div>
    </Collapse>
  );
};

export default AlbumQuery;
