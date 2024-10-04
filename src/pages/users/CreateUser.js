import React from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import "../../assets/css/job-css/JobForm.css";
import {
  optionsDepartment,
  optionsGender,
  optionsUserRole,
} from "~/data/Constants";
import { FaAngleRight } from "react-icons/fa";
import ApiUser from "~/services/usersApi";
import { toast } from "react-toastify";
import { getMessage } from "~/data/Messages";

const CreateUser = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      dob: "",
      address: "",
      phone: "",
      gender: "",
      userRole: "",
      department: "",
      userStatus: "ACTIVE",
      note: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .matches(
          /^[A-ZÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬĐÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ][a-záàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]*(\s[A-ZÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬĐÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴ][a-záàảãạăắằẳẵặâấầẩẫậđéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵ]*)+$/,
          getMessage("ME041")
        )
        .required(getMessage("ME002")),
      email: Yup.string()
        .email(getMessage("ME009"))
        .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, getMessage("ME028"))
        .required(getMessage("ME002")),
      dob: Yup.date()
        .max(new Date(), getMessage("ME010"))
        .required(getMessage("ME002")),
      phone: Yup.string()
        .matches(/^[0-9]+$/, getMessage("ME029"))
        .length(10, getMessage("ME029")),
      gender: Yup.string().required(getMessage("ME002")),
      userRole: Yup.string().required(getMessage("ME002")),
      department: Yup.string().required(getMessage("ME002")),
    }),
    onSubmit: async (values) => {
      const userData = {
        address: values.address,
        department: values.department,
        dob: values.dob,
        email: values.email.trim(),
        fullName: values.fullName.trim(),
        gender: values.gender,
        note: values.note.trim(),
        phone: values.phone,
        userRole: values.userRole,
        userStatus: "ACTIVE",
      };

      const res = await ApiUser.postUser(userData);

      if (res && res.success) {
        navigate("/user");
        toast.success(getMessage("ME027"));
      } else {
        toast.error(getMessage("ME026"));
      }
    },
  });

  return (
    <Container className="mb-3">
      <div className="breadcrumb__group">
        <span className="breadcrumb-link" onClick={() => navigate("/user")}>
          User List
        </span>
        <FaAngleRight />
        <span className="breadcrumb-link__active">Create user</span>
      </div>
      <div className="candidate-detail">
        <Form onSubmit={formik.handleSubmit}>
          <div className="section">
            <div className="section-personal-info">
              <Row>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Full name</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={7}>
                      <Form.Control
                        type="text"
                        placeholder="Type a name"
                        {...formik.getFieldProps("fullName")}
                      />
                    </Col>
                    {formik.touched.fullName && formik.errors.fullName ? (
                      <div className="text-danger">
                        {formik.errors.fullName}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Email</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={7}>
                      <Form.Control
                        type="text"
                        placeholder="Type an email"
                        {...formik.getFieldProps("email")}
                      />
                    </Col>
                    {formik.touched.email && formik.errors.email ? (
                      <div className="text-danger">{formik.errors.email}</div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>

              {/* Second Row */}
              <Row>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>D.O.B</strong>
                    </Form.Label>
                    <Col sm={7}>
                      <Form.Control
                        type="date"
                        name="dob"
                        {...formik.getFieldProps("dob")}
                      />
                    </Col>
                    {formik.touched.dob && formik.errors.dob ? (
                      <div className="text-danger">{formik.errors.dob}</div>
                    ) : null}
                  </Form.Group>
                </Col>
                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Address</strong>
                    </Form.Label>
                    <Col sm={7}>
                      <Form.Control
                        type="text"
                        name="address"
                        placeholder="Type an address"
                        {...formik.getFieldProps("address")}
                      />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>

              {/* Third Row */}
              <Row>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Phone Number</strong>
                    </Form.Label>
                    <Col sm={7}>
                      <Form.Control
                        type="text"
                        name="phone"
                        placeholder="Type a phone"
                        {...formik.getFieldProps("phone")}
                      />
                    </Col>
                    {formik.touched.phone && formik.errors.phone ? (
                      <div className="text-danger">{formik.errors.phone}</div>
                    ) : null}
                  </Form.Group>
                </Col>
                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Gender</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={7}>
                      <Select
                        value={optionsGender.find(
                          (option) => option.value === formik.values.gender
                        )} // Cung cấp đối tượng phù hợp cho Select
                        onChange={
                          (selectedOption) =>
                            formik.setFieldValue("gender", selectedOption.value) // Lưu giá trị vào Formik
                        }
                        options={optionsGender}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Select gender"
                      />
                    </Col>
                    {formik.touched.gender && formik.errors.gender ? (
                      <div className="text-danger">{formik.errors.gender}</div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>

              {/* Fourth Row */}
              <Row>
                <Col xs={6}>
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Role</strong>
                    </Form.Label>
                    <Col sm={7}>
                      <Select
                        value={optionsUserRole.find(
                          (option) => option.value === formik.values.userRole
                        )} // Cung cấp đối tượng phù hợp cho Select
                        onChange={
                          (selectedOption) =>
                            formik.setFieldValue(
                              "userRole",
                              selectedOption.value
                            ) // Lưu giá trị vào Formik
                        }
                        options={optionsUserRole}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Select role"
                      />
                    </Col>
                    {formik.touched.userRole && formik.errors.userRole ? (
                      <div className="text-danger">
                        {formik.errors.userRole}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Department</strong>
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Col sm={7}>
                      <Select
                        value={optionsDepartment.find(
                          (option) => option.value === formik.values.department
                        )} // Cung cấp đối tượng phù hợp cho Select
                        onChange={
                          (selectedOption) =>
                            formik.setFieldValue(
                              "department",
                              selectedOption.value
                            ) // Lưu giá trị vào Formik
                        }
                        options={optionsDepartment}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Select department(s)"
                      />
                    </Col>
                    {formik.touched.department && formik.errors.department ? (
                      <div className="text-danger">
                        {formik.errors.department}
                      </div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>

              {/* Fifth Row */}
              <Row>
                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Status</strong>
                    </Form.Label>
                    <Col sm={7}>
                      <Select
                        value={{ label: "Active", value: "ACTIVE" }}
                        onChange={() => {}} // Không thực hiện hành động nào khi thay đổi
                        options={[
                          {
                            label: "Active",
                            value: "ACTIVE",
                            isDisabled: true,
                          },
                        ]}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        isDisabled={true} // Disable toàn bộ Select để không thể chọn
                      />
                    </Col>
                    {formik.touched.status && formik.errors.status ? (
                      <div className="text-danger">{formik.errors.status}</div>
                    ) : null}
                  </Form.Group>
                </Col>

                <Col xs={6} className="mb-3">
                  <Form.Group as={Row}>
                    <Form.Label column sm={3}>
                      <strong>Note</strong>
                    </Form.Label>
                    <Col sm={7}>
                      <Form.Control
                        type="text"
                        name="note"
                        placeholder=""
                        {...formik.getFieldProps("note")}
                      />
                    </Col>
                    {formik.touched.note && formik.errors.note ? (
                      <div className="text-danger">{formik.errors.note}</div>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>
            </div>
          </div>

          {/* Submit and Cancel Buttons */}
          <Row>
            <div className="button-group">
              <button
                type="submit"
                className="button-form button-form--primary"
              >
                Submit
              </button>
              <button
                type="button"
                className="button-form button-form--secondary"
                onClick={() => navigate("/user")}
              >
                Cancel
              </button>
            </div>
          </Row>
        </Form>
      </div>
    </Container>
  );
};

export default CreateUser;
