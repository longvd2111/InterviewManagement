import React, { useEffect, useState } from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FaAngleRight } from "react-icons/fa";
import ApiUser from "~/services/usersApi";
import Select from "react-select";
import "../../assets/css/job-css/JobForm.css";
import {
  optionsGender,
  optionsUserRole,
  optionsDepartment,
  optionsUserStatus,
} from "~/data/Constants";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { convertDobArrayToISO } from "~/utils/Validate";
import "../../assets/css/user-css/updateUser.module.css";
import { getMessage } from "~/data/Messages";

const UpdateUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState(null); // Change default value to null

  const fetchUser = async (id) => {
    const res = await ApiUser.getDetailUser(id);
    if (res) {
      setUser({ ...res, dob: convertDobArrayToISO(res.dob) });
    }
  };

  useEffect(() => {
    if (id) {
      fetchUser(id);
    }
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: user?.id || "",
      fullName: user?.fullName || "",
      email: user?.email || "",
      dob: user?.dob || "",
      address: user?.address || "",
      phone: user?.phone || "",
      gender: user?.gender || "",
      userRole: user?.userRole || "",
      department: user?.department || "",
      userStatus: user?.userStatus || "",
      note: user?.note || "",
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
        id: values.id,
        address: values.address,
        department: values.department,
        dob: values.dob,
        email: values.email,
        fullName: values.fullName,
        gender: values.gender,
        note: values.note,
        phone: values.phone,
        userRole: values.userRole,
        userStatus: values.userStatus,
      };

      console.log(userData);

      const res = await ApiUser.editUser(userData);
      console.log(res);

      if (res && res.success) {
        navigate("/user");
        toast.success(getMessage("ME014"));
      } else {
        toast.error(getMessage("ME013"));
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
        <span className="breadcrumb-link__active">Edit User</span>
      </div>
      <div className="candidate-detail">
        <Row>
          <Form onSubmit={formik.handleSubmit}>
            <div className="section">
              <div className="section-personal-info">
                <Row>
                  <Col xs={6}>
                    <Form.Group as={Row}>
                      <Form.Label column sm={3}>
                        <strong>Full Name</strong>
                        <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Col sm={7}>
                        <Form.Control
                          type="text"
                          name="fullName"
                          {...formik.getFieldProps("fullName")}
                        />
                      </Col>
                      {formik.touched.fullName && formik.errors.fullName && (
                        <div className="text-danger">
                          {formik.errors.fullName}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col xs={6} className="mb-3">
                    <Form.Group as={Row}>
                      <Form.Label column sm={3}>
                        <strong>Email</strong>
                        <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Col sm={7}>
                        <Form.Control {...formik.getFieldProps("email")} />
                      </Col>
                      {formik.touched.email && formik.errors.email && (
                        <div className="text-danger">{formik.errors.email}</div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col xs={6}>
                    <Form.Group as={Row}>
                      <Form.Label column sm={3}>
                        <strong>D.O.B</strong>
                      </Form.Label>
                      <Col sm={7}>
                        <Form.Control
                          type="date"
                          {...formik.getFieldProps("dob")}
                        />
                      </Col>
                      {formik.touched.dob && formik.errors.dob && (
                        <div className="text-danger">{formik.errors.dob}</div>
                      )}
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
                          {...formik.getFieldProps("address")}
                        />
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col xs={6}>
                    <Form.Group as={Row}>
                      <Form.Label column sm={3}>
                        <strong>Phone number</strong>
                      </Form.Label>
                      <Col sm={7}>
                        <Form.Control
                          type="text"
                          name="phone"
                          {...formik.getFieldProps("phone")}
                        />
                      </Col>
                      {formik.touched.phone && formik.errors.phone && (
                        <div className="text-danger">{formik.errors.phone}</div>
                      )}
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
                          name="gender"
                          options={optionsGender}
                          value={optionsGender?.find(
                            (s) => (s.value = formik.values?.gender)
                          )}
                          onChange={(option) =>
                            formik.setFieldValue("gender", option.value)
                          }
                        />
                      </Col>
                      {formik.touched.gender && formik.errors.gender && (
                        <div className="text-danger">
                          {formik.errors.gender}
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col xs={6}>
                    <Form.Group as={Row}>
                      <Form.Label column sm={3}>
                        <strong>Role</strong>
                        <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Col sm={7}>
                        <Select
                          name="role"
                          options={optionsUserRole}
                          value={optionsUserRole?.find(
                            (u) => u.value === formik.values?.userRole
                          )}
                          onChange={(option) =>
                            formik.setFieldValue("role", option.value)
                          }
                        />
                      </Col>
                      {formik.touched.role && formik.errors.role && (
                        <div className="text-danger">{formik.errors.role}</div>
                      )}
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
                          name="department"
                          options={optionsDepartment}
                          value={optionsDepartment?.find(
                            (d) => d.value === formik.values?.department
                          )}
                          onChange={(option) =>
                            formik.setFieldValue("department", option.value)
                          }
                        />
                      </Col>
                      {formik.touched.department &&
                        formik.errors.department && (
                          <div className="text-danger">
                            {formik.errors.department}
                          </div>
                        )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col xs={6}>
                    <Form.Group as={Row}>
                      <Form.Label column sm={3}>
                        <strong>Status</strong>
                        <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Col sm={7}>
                        <Select
                          name="status"
                          value={optionsUserStatus?.find(
                            (uS) => uS.value === formik.values?.userStatus
                          )}
                          isDisabled={true}
                        />
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col xs={6}>
                    <Form.Group as={Row}>
                      <Form.Label column sm={3}>
                        <strong>Note</strong>
                      </Form.Label>
                      <Col sm={7}>
                        <Form.Control
                          as="textarea"
                          {...formik.getFieldProps("note")}
                        />
                      </Col>
                      {formik.touched.note && formik.errors.note && (
                        <div className="text-danger">{formik.errors.note}</div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              </div>
            </div>
            <Row className="mt-4">
              <Col className="d-flex justify-content-center">
                <button
                  type="submit"
                  className="button-form button-form--primary"
                >
                  Update
                </button>
                <button
                  className="button-form"
                  onClick={() => navigate(-1)}
                  type="button"
                >
                  Cancel
                </button>
              </Col>
            </Row>
          </Form>
        </Row>
      </div>
    </Container>
  );
};

export default UpdateUser;
