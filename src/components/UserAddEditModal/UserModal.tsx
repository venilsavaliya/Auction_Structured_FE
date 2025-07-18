import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  IconButton,
  Typography,
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller,type SubmitErrorHandler } from "react-hook-form";
import { toast } from "react-toastify";

import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { UserSchema } from "../../Schemas/UserSchema";
import type { UserFormInputs } from "../../Models/FormInterfaces/UserFormInput";
import userService from "../../Services/UserService/UserServices";

// Define the TypeScript interface for form data
// export interface UserFormInputs {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   role: string;
//   password: string;
//   dateOfBirth: string;
//   gender: string;
//   mobileNumber: string;
//   image: File | string;
// }

// Define the props for the component
interface UserModalProps {
  open: boolean;
  onClose: () => void;
 
  isEdit?: boolean;
  userId?: number | null;
}

const UserModal: React.FC<UserModalProps> = ({
  open,
  onClose,
  isEdit = false,
  userId = null,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormInputs>({
    defaultValues: {
      id: 0,
      firstName: "",
      lastName: "",
      email: "",
      role: "",
      password: "",
      dateOfBirth: "",
      gender: "",
      mobileNumber: "",
      image: "",
    },
    resolver: yupResolver(UserSchema),
  });

  const [preview, setPreview] = useState<string | null>(null);

  const roleOptions = ["Admin", "Manager", "User"];
  const genderOptions = ["Male", "Female", "Other"];

  const onError: SubmitErrorHandler<UserFormInputs> = (errors) => {
    console.log("Validation errors:", errors);
  };

  useEffect(() => {
    const loadData = async () => {
        console.log("isedit",isEdit," ",userId)
      if (isEdit && userId) {
        try {
          const res = await userService.GetUserById(userId);
          const user = res.data;
          const formattedData: UserFormInputs = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName ?? "",
            dateOfBirth: user.dateOfBirth,
            email: user.email,
            role: user.role,
            gender: user.gender,
            mobileNumber: user.mobileNumber,
            image: user.image,
            password: "",
          };

          setPreview(user.image);
          reset(formattedData);
        } catch (error) {
          toast.error("Failed to load user");
          console.error(error);
        }
      } else {
        reset({
          id: 0,
          firstName: "",
          lastName: "",
          email: "",
          role: "",
          password: "",
          dateOfBirth: "",
          gender: "",
          mobileNumber: "",
          image: "",
        });
        setPreview(null);
      }
    };

    if (open) {
      loadData();
    }
  }, [open, isEdit, userId, reset]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data: UserFormInputs) => {
    try {
      const formData = new FormData();

      if (data.id != undefined && data.id != 0) {
        formData.append("Id", data.id.toString());
      }
      formData.append("FirstName", data.firstName);
      formData.append("Email", data.email);
      formData.append("Role", data.role);
      formData.append("Gender", data.gender);
      formData.append("MobileNumber", data.mobileNumber);
      formData.append(
        "DateOfBirth",
        data.dateOfBirth
          ? new Date(data.dateOfBirth).toLocaleDateString("en-CA")
          : ""
      );

      if (data.lastName) {
        formData.append("LastName", data.lastName);
      }

      if (typeof data.image === "string") {
        // Already a URL - maybe skip?
      } else {
        if (data.image != null && data.image != undefined) {
          formData.append("Image", data.image);
        }
      }

      if (!isEdit && data.password!=undefined) {
        formData.append("Password", data.password);
      }

      if (isEdit) {
        // await axios.put("/User", formData);
        await userService.UpdateUser(formData);
        toast.success("User updated successfully");
      } else {
        await userService.AddUser(formData);
        toast.success("User created successfully");
      }

      onClose();
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.Message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{isEdit ? "Edit User" : "Create User"}</DialogTitle>
      <DialogContent sx={{ mt: 1 }}>
        <Controller
          name="id"
          control={control}
          render={({ field }) => <input type="hidden" {...field} />}
        />

        <Controller
          name="image"
          control={control}
          render={({ field, fieldState }) => (
            <Box mb={1} display="flex" justifyContent="center">
              <Box position="relative">
                <Avatar src={preview || ""} sx={{ width: 100, height: 100 }} />
                <label
                  htmlFor="upload-image"
                  style={{ position: "absolute", bottom: 0, right: -8 }}
                >
                  <IconButton component="span">
                    <input
                      id="upload-image"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        handleImageChange(e);
                        field.onChange(e.target.files?.[0]);
                      }}
                    />
                    <PhotoCameraIcon />
                  </IconButton>
                </label>
              </Box>
              {fieldState.error && (
                <Typography variant="caption" color="error">
                  {fieldState.error.message}
                </Typography>
              )}
            </Box>
          )}
        />

        <Box display="flex" gap={2}>
          <Controller
            name="firstName"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="First Name"
                fullWidth
                margin="normal"
                required
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Last Name"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Box>

        <Box display="flex" gap={2}>
          <Controller
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Email"
                fullWidth
                margin="normal"
                required
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          {!isEdit && (
            <Controller
              name="password"
              control={control}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  required
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          )}
        </Box>

        <Box display="flex" gap={2}>
          <Controller
            name="role"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl fullWidth margin="normal" error={!!fieldState.error}>
                <InputLabel>Select Role</InputLabel>
                <Select {...field} label="Select Role">
                  {roleOptions.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
                <Typography variant="caption" color="error">
                  {fieldState.error?.message}
                </Typography>
              </FormControl>
            )}
          />
          <Controller
            name="gender"
            control={control}
            render={({ field, fieldState }) => (
              <FormControl fullWidth margin="normal" error={!!fieldState.error}>
                <InputLabel>Select Gender</InputLabel>
                <Select {...field} label="Select Gender">
                  {genderOptions.map((gender) => (
                    <MenuItem key={gender} value={gender}>
                      {gender}
                    </MenuItem>
                  ))}
                </Select>
                <Typography variant="caption" color="error">
                  {fieldState.error?.message}
                </Typography>
              </FormControl>
            )}
          />
        </Box>

        <Box display="flex" gap={2}>
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Date of Birth"
                type="date"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                required
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="mobileNumber"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Mobile Number"
                fullWidth
                margin="normal"
                required
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit, onError)}
          variant="contained"
          color="primary"
        >
          {isEdit ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserModal;
