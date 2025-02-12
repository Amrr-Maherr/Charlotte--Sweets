import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("AuthToken"));
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "https://management.mlmcosmo.com/api/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfileData(response.data.admin);
        setEditedName(response.data.admin.name);
        setEditedEmail(response.data.admin.email);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditedName(profileData.name);
    setEditedEmail(profileData.email);
  };

  const handleSaveClick = async () => {
    const updateProfileEndpoint = "https://management.mlmcosmo.com/api/profile";

    try {
      const response = await axios.put(
        updateProfileEndpoint,
        {
          name: editedName,
          email: editedEmail,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Profile updated:", response.data);
      setProfileData({ ...profileData, name: editedName, email: editedEmail });
      setIsEditing(false);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Profile updated successfully!",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to update profile.",
      });
    }
  };

  const handleChangePassword = async () => {
    setIsChangingPassword(true);

    try {
      const response = await axios.post(
        "https://management.mlmcosmo.com/api/change-password",
        {
          old_password: oldPassword,
          new_password: newPassword,
          new_password_confirmation: newPasswordConfirmation,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Password changed:", response.data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Password changed successfully!",
      });
      setOldPassword("");
      setNewPassword("");
      setNewPasswordConfirmation("");
    } catch (error) {
      console.error("Error changing password:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          error.response?.data?.message ||
          "Failed to change password. Please check your inputs.",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!profileData) {
    return (
      <p style={{ textAlign: "center", padding: "20px", color: "#A9411D" }}>
        Could not load profile data.
      </p>
    );
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  };

  return (
    <>
      <motion.div
        style={{
          maxWidth: "600px",
          margin: "20px auto",
          padding: "30px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          backgroundColor: "#f9f9f9",
          fontFamily: "Arial, sans-serif",
          color: "#333",
        }}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <h1
          style={{
            fontSize: "2em",
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#A9411D",
            textAlign: "center",
          }}
        >
          Profile
        </h1>

        {isEditing ? (
          <>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name:
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
              />
            </div>
            <div style={{ textAlign: "center" }}>
              <motion.button
                style={{
                  backgroundColor: "#A9411D",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "8px 15px",
                  cursor: "pointer",
                  marginRight: "10px",
                }}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleSaveClick}
              >
                Save
              </motion.button>
              <motion.button
                style={{
                  backgroundColor: "#ccc",
                  color: "#333",
                  border: "none",
                  borderRadius: "5px",
                  padding: "8px 15px",
                  cursor: "pointer",
                }}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleCancelClick}
              >
                Cancel
              </motion.button>
            </div>
          </>
        ) : (
          <>
            <p
              style={{
                fontSize: "1.1em",
                lineHeight: "1.6",
                marginBottom: "10px",
              }}
            >
              <strong style={{ fontWeight: "bold", color: "#555" }}>
                Name:
              </strong>{" "}
              {profileData.name}
            </p>

            <p
              style={{
                fontSize: "1.1em",
                lineHeight: "1.6",
                marginBottom: "10px",
              }}
            >
              <strong style={{ fontWeight: "bold", color: "#555" }}>
                Email:
              </strong>{" "}
              {profileData.email}
            </p>

            <p
              style={{
                fontSize: "1em",
                lineHeight: "1.4",
                marginBottom: "8px",
                color: "#777",
              }}
            >
              <strong style={{ fontWeight: "bold", color: "#555" }}>
                Created At:
              </strong>{" "}
              {profileData.created_at}
            </p>

            <p
              style={{
                fontSize: "1em",
                lineHeight: "1.4",
                color: "#777",
                marginBottom: 0,
              }}
            >
              <strong style={{ fontWeight: "bold", color: "#555" }}>
                Updated At:
              </strong>{" "}
              {profileData.updated_at}
            </p>

            <div style={{ textAlign: "center", marginTop: "20px" }}>
              <motion.button
                style={{
                  backgroundColor: "#A9411D",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  padding: "8px 15px",
                  cursor: "pointer",
                }}
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleEditClick}
              >
                Edit Profile
              </motion.button>
            </div>
          </>
        )}
      </motion.div>

      {/* Password Change Form */}
      <motion.div
        style={{
          maxWidth: "600px",
          margin: "20px auto",
          padding: "30px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
          backgroundColor: "#f9f9f9",
          fontFamily: "Arial, sans-serif",
          color: "#333",
        }}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <h2
          style={{
            fontSize: "1.5em",
            fontWeight: "bold",
            marginBottom: "20px",
            color: "#A9411D",
            textAlign: "center",
          }}
        >
          Change Password
        </h2>

        <div className="mb-3">
          <label htmlFor="oldPassword" className="form-label">
            Old Password:
          </label>
          <input
            type="password"
            className="form-control"
            id="oldPassword"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="newPassword" className="form-label">
            New Password:
          </label>
          <input
            type="password"
            className="form-control"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm New Password:
          </label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            value={newPasswordConfirmation}
            onChange={(e) => setNewPasswordConfirmation(e.target.value)}
          />
        </div>

        <div style={{ textAlign: "center" }}>
          <motion.button
            style={{
              backgroundColor: "#A9411D",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "8px 15px",
              cursor: "pointer",
            }}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={handleChangePassword}
            disabled={isChangingPassword}
          >
            {isChangingPassword ? "Changing..." : "Change Password"}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}

export default Profile;
