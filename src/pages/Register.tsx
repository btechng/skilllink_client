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
} from "@mui/material";
import { Formik, Form, FormikHelpers, ErrorMessage } from "formik";
import * as Yup from "yup";
import { registerUser } from "../components/api"; // ✅ use api.ts helper

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

// 🔹 Form value types
interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
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

// 🔹 Initial values
const initialValues: RegisterFormValues = {
  name: "",
  email: "",
  password: "",
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

// 🔹 Yup validation
const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "At least 6 characters").required("Required"),
  phone: Yup.string().required("Required"),
});

const steps = ["General Info", "Role Details", "Review & Submit"];

export default function Register() {
  const [activeStep, setActiveStep] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);

  const handleSubmit = async (
    values: RegisterFormValues,
    { setSubmitting }: FormikHelpers<RegisterFormValues>
  ) => {
    if (activeStep < steps.length - 1) {
      setActiveStep((s) => s + 1);
      setSubmitting(false);
      return;
    }

    // ✅ Build payload
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
      const { data } = await registerUser(payload); // ✅ use api helper
      localStorage.setItem("token", data.token);
      setMsg("✅ Registered successfully! You can now log in.");
    } catch (e: any) {
      setMsg(e.response?.data?.message || "❌ Registration failed");
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
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              {/* Step 1: General Info */}
              {activeStep === 0 && (
                <>
                  {[
                    "name",
                    "email",
                    "password",
                    "phone",
                    "country",
                    "city",
                  ].map((field) => (
                    <Box sx={{ flex: "1 1 100%" }} key={field}>
                      <TextField
                        fullWidth
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        name={field}
                        type={field === "password" ? "password" : "text"}
                        value={values[field as keyof RegisterFormValues]}
                        onChange={handleChange}
                      />
                      <ErrorText name={field} />
                    </Box>
                  ))}

                  <Box sx={{ flex: "1 1 100%" }}>
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
                  </Box>

                  <Box sx={{ flex: "1 1 100%", mt: 1 }}>
                    <Button
                      variant="outlined"
                      component="label"
                      sx={{
                        background: "linear-gradient(120deg, #ffffff, #f0f0f0)",
                        transition: "0.3s",
                        "&:hover": {
                          background:
                            "linear-gradient(120deg, #a8e6cf, #dcedc1)",
                        },
                      }}
                    >
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
                        sx={{ width: 60, height: 60, mt: 1 }}
                      />
                    )}
                  </Box>
                </>
              )}

              {/* Step 2: Role-specific */}
              {activeStep === 1 && values.role === "freelancer" && (
                <>
                  {[
                    "title",
                    "bio",
                    "skills",
                    "portfolioLinks",
                    "languages",
                  ].map((field) => (
                    <Box sx={{ flex: "1 1 100%" }} key={field}>
                      <TextField
                        fullWidth
                        multiline={field === "bio"}
                        rows={field === "bio" ? 3 : 1}
                        label={field.charAt(0).toUpperCase() + field.slice(1)}
                        name={field}
                        value={values[field as keyof RegisterFormValues]}
                        onChange={handleChange}
                      />
                    </Box>
                  ))}
                  <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
                    <TextField
                      select
                      fullWidth
                      label="Experience Level"
                      name="experienceLevel"
                      value={values.experienceLevel}
                      onChange={handleChange}
                    >
                      <MenuItem value="beginner">Beginner</MenuItem>
                      <MenuItem value="intermediate">Intermediate</MenuItem>
                      <MenuItem value="expert">Expert</MenuItem>
                    </TextField>
                  </Box>
                  <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
                    <TextField
                      fullWidth
                      type="number"
                      label="Hourly Rate ($)"
                      name="hourlyRate"
                      value={values.hourlyRate}
                      onChange={handleChange}
                    />
                  </Box>
                </>
              )}

              {activeStep === 1 && values.role === "client" && (
                <>
                  {[
                    "companyName",
                    "companyWebsite",
                    "industry",
                    "teamSize",
                  ].map((field) => (
                    <Box
                      sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}
                      key={field}
                    >
                      <TextField
                        fullWidth
                        label={field}
                        name={field}
                        value={values[field as keyof RegisterFormValues]}
                        onChange={handleChange}
                      />
                    </Box>
                  ))}
                </>
              )}

              {/* Step 3: Review */}
              {activeStep === 2 && (
                <Box sx={{ flex: "1 1 100%" }}>
                  <Typography variant="h6">Review Your Details:</Typography>
                  <pre>{JSON.stringify(values, null, 2)}</pre>
                </Box>
              )}

              {/* Buttons */}
              <Box
                sx={{
                  flex: "1 1 100%",
                  display: "flex",
                  justifyContent: "space-between",
                  mt: 2,
                }}
              >
                <Button
                  onClick={() => setActiveStep((s) => s - 1)}
                  disabled={activeStep === 0}
                  sx={{
                    background: "linear-gradient(120deg, #ffffff, #f0f0f0)",
                    "&:hover": {
                      background: "linear-gradient(120deg, #ffd3b6, #ffaaa5)",
                    },
                  }}
                >
                  🔙 Back
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  sx={{
                    background: "linear-gradient(120deg, #a8e6cf, #dcedc1)",
                    "&:hover": {
                      background: "linear-gradient(120deg, #81c784, #66bb6a)",
                    },
                  }}
                >
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
