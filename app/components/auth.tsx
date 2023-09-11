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

 // 使用fetch调用后端API进行用户认证
 const authenticateUser = (username: string, password: string) => {
  return fetch('https://service-kaye4bke-1307978726.gz.apigw.tencentcs.com/release/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password
    })
  }).then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });
};

const handleLogin = () => {
  authenticateUser(username, password)
    .then(data => {
      // 如果登录成功，保存返回的JWT token
      const token = data.access_token;
      console.log(token);
      access.updateMeToken(token);  // 更新为从后端接收的token
      goHome();
    })
    .catch(error => {
      // 错误处理时，我们可以将HTTP状态码（如果有）和其他可能的错误消息显示给用户
      setError(error.message || "Unexpected error occurred.");
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
