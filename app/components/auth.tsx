import styles from "./auth.module.scss";
import { IconButton } from "./button";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { useAccessStore } from "../store";
import Locale from "../locales";
import BotIcon from "../icons/bot.svg";

export function AuthPage() {
  const navigate = useNavigate();
  const access = useAccessStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // 1. Check if user is already authorized, if so redirect to home
  useEffect(() => {
    if (access.isAuthorized()) {
      goHome();
    }
  }, [access]);

  const goHome = () => navigate(Path.Home);

  // Mock API call for user authentication
  const authenticateUser = (username:string, password:string) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === "admin" && password === "password123") {
          resolve({ success: true });
        } else {
          reject({ success: false, message: "Invalid username or password." });
        }
      }, 1000);
    });
  };

  const handleLogin = () => {
    authenticateUser(username, password)
      .then(response => {
        if (response) {
          // 3. After login, update the token or access code to simulate setting an auth state
          access.updateToken('user_token'); // you can set a real token here
          goHome();
        }
      })
      .catch(error => {
        setError(error.message);
      });
  };

  return (
    <div className={styles["auth-page"]}>
      <div className={`no-dark ${styles["auth-logo"]}`}>
        <BotIcon />
      </div>

      <div className={styles["auth-title"]}>{Locale.Auth.Title}</div>
      <div className={styles["auth-tips"]}>{Locale.Auth.Tips}</div>

      <input
        className={styles["auth-input"]}
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className={styles["auth-input"]}
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <div className={styles["auth-error"]}>{error}</div>}

      <div className={styles["auth-actions"]}>
        <IconButton
          text={Locale.Auth.Confirm}
          type="primary"
          onClick={handleLogin}
        />
        <IconButton text={Locale.Auth.Later} onClick={goHome} />
      </div>
    </div>
  );
}
