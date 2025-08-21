import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  InputAdornment,
} from "@mui/material";
import { Formik, Form, FormikHelpers, ErrorMessage } from "formik";
import * as Yup from "yup";
import { registerUser } from "../components/api";
import { useNavigate } from "react-router-dom";

// 🔹 Helper ErrorText Component
const ErrorText: React.FC<{ name: string }> = ({ name }) => (
  <ErrorMessage
    name={name}
    render={(msg) => (
      <div style={{ color: "red", fontSize: "0.9rem", marginTop: 4 }}>
        {msg}
      </div>
    )}
  />
);

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "freelancer" | "client";
  phone: string;
  country: string;
  city: string;
  profileImage: string;
  title: string;
  bio: string;
  skills: string;
  experienceLevel: string;
  hourlyRate: number;
  portfolioLinks: string;
  languages: string;
  companyName: string;
  companyWebsite: string;
  industry: string;
  teamSize: string;
}

const initialValues: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "freelancer",
  phone: "",
  country: "",
  city: "",
  profileImage: "",
  title: "",
  bio: "",
  skills: "",
  experienceLevel: "beginner",
  hourlyRate: 0,
  portfolioLinks: "",
  languages: "",
  companyName: "",
  companyWebsite: "",
  industry: "",
  teamSize: "",
};

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "At least 6 characters").required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Required"),
});

const steps = ["General Info", "Role Details", "Review & Submit"];

export default function Register() {
  const [activeStep, setActiveStep] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (
    values: RegisterFormValues,
    { setSubmitting }: FormikHelpers<RegisterFormValues>
  ) => {
    if (activeStep < steps.length - 1) {
      setActiveStep((s) => s + 1);
      setSubmitting(false);
      return;
    }

    const payload = {
      ...values,
      skills: values.skills
        ? values.skills.split(",").map((s) => s.trim())
        : [],
      portfolioLinks: values.portfolioLinks
        ? values.portfolioLinks.split(",").map((s) => s.trim())
        : [],
      languages: values.languages
        ? values.languages.split(",").map((s) => s.trim())
        : [],
    };

    try {
      const { data } = await registerUser(payload);
      localStorage.setItem("token", data.token);
      setMsg("✅ Registered successfully! Redirecting to dashboard...");

      // Redirect after a short delay
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (e: any) {
      const errorMsg =
        e.response?.data?.errors?.map((err: any) => err.msg).join(", ") ||
        e.response?.data?.message ||
        "❌ Registration failed";
      setMsg(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const uploadImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "social_blog_upload");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/dkjvfszog/image/upload`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    setFieldValue("profileImage", data.secure_url);
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, setFieldValue, isSubmitting }) => (
          <Form>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Step 1: General Info */}
              {activeStep === 0 && (
                <>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                  />
                  <ErrorText name="name" />

                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                  />
                  <ErrorText name="email" />

                  {/* Password Field */}
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={values.password}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Box
                            sx={{ cursor: "pointer", fontSize: "1.2rem" }}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? "🙈" : "👁️"}
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <ErrorText name="password" />

                  {/* Confirm Password Field */}
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={values.confirmPassword}
                    onChange={handleChange}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Box
                            sx={{ cursor: "pointer", fontSize: "1.2rem" }}
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                          >
                            {showConfirmPassword ? "🙈" : "👁️"}
                          </Box>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <ErrorText name="confirmPassword" />

                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                  />
                  <ErrorText name="phone" />

                  <TextField
                    fullWidth
                    label="Country"
                    name="country"
                    value={values.country}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    label="City"
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                  />

                  <TextField
                    select
                    fullWidth
                    label="Role"
                    name="role"
                    value={values.role}
                    onChange={handleChange}
                  >
                    <MenuItem value="freelancer">Freelancer</MenuItem>
                    <MenuItem value="client">Client</MenuItem>
                  </TextField>

                  <Button variant="outlined" component="label">
                    📸 Upload Profile Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={(e) => uploadImage(e, setFieldValue)}
                    />
                  </Button>
                  {values.profileImage && (
                    <Avatar
                      src={values.profileImage}
                      sx={{ width: 60, height: 60 }}
                    />
                  )}
                </>
              )}

              {/* Step 2: Role-specific */}
              {activeStep === 1 && values.role === "freelancer" && (
                <>
                  <TextField
                    fullWidth
                    label="Title"
                    name="title"
                    value={values.title}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Bio"
                    name="bio"
                    value={values.bio}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    label="Skills (comma separated), Graphics,Business,Web Development"
                    name="skills"
                    value={values.skills}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    label="Portfolio Links"
                    name="portfolioLinks"
                    value={values.portfolioLinks}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    label="Languages"
                    name="languages"
                    value={values.languages}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    select
                    label="Experience Level"
                    name="experienceLevel"
                    value={values.experienceLevel}
                    onChange={handleChange}
                  >
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="expert">Expert</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    type="number"
                    label="Hourly Rate"
                    name="hourlyRate"
                    value={values.hourlyRate}
                    onChange={handleChange}
                  />
                </>
              )}

              {activeStep === 1 && values.role === "client" && (
                <>
                  <TextField
                    fullWidth
                    label="Company Name"
                    name="companyName"
                    value={values.companyName}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    label="Company Website"
                    name="companyWebsite"
                    value={values.companyWebsite}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    label="Industry"
                    name="industry"
                    value={values.industry}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    label="Team Size"
                    name="teamSize"
                    value={values.teamSize}
                    onChange={handleChange}
                  />
                </>
              )}

              {/* Step 3: Review */}
              {activeStep === 2 && (
                <Box>
                  <Typography variant="h6">Review Your Details:</Typography>
                  <pre>{JSON.stringify(values, null, 2)}</pre>
                </Box>
              )}

              {/* Buttons */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 2,
                }}
              >
                <Button
                  onClick={() => setActiveStep((s) => s - 1)}
                  disabled={activeStep === 0}
                >
                  🔙 Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {activeStep === steps.length - 1 ? "✅ Submit" : "➡ Next"}
                </Button>
              </Box>
            </Box>
          </Form>
        )}
      </Formik>

      {msg && (
        <Alert
          severity={msg.startsWith("✅") ? "success" : "error"}
          sx={{ mt: 2 }}
        >
          {msg}
        </Alert>
      )}
    </Box>
  );
}
