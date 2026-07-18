import React from "react";
import { Button, Checkbox, Form, Input, Alert, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import bgImg from "\faculte-des-sciences-de-tetouan-fst.jpg"

export const Login: React.FC = () => {
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    const { username, password } = values;

    if (username === "admin" && password === "888888") {
      message.success("Login successful!");
      navigate("/");
    } else {
      setError("Incorrect username or password.");
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Left Form Section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          backgroundColor: "#fff",
        }}
      >
        <div style={{ maxWidth: 360, width: "100%" }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <img
              src="/fslogo.png" // Replace with your logo path
              alt="Logo"
              style={{ height: 100 }}
            />
          </div>

          <h1 style={{ textAlign: "center", marginBottom: 8, color: "Blue" }}>Sign in</h1>
          <p style={{ textAlign: "center", marginBottom: 24, color: "#888" }}>
            Welcome back! Please enter your details below to sign in.
          </p>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              closable
              style={{ marginBottom: 24 }}
              onClose={() => setError(null)}
            />
          )}

          <Form
            name="login_form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "Please input your username!" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
                size="large"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                size="large"
              />
            </Form.Item>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
              <a href="#">Forgot password?</a>
            </div>

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block>
                Log in
              </Button>
            </Form.Item>

            <div style={{ textAlign: "center" }}>
              Don't have an account? <a href="#">Sign up now</a>
            </div>
          </Form>
        </div>
      </div>

      {/* Right Image Section */}
      <div
        style={{
          flex: 1,
          //backgroundImage: "url('/fslogo.png')", // Replace with your image path
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
    </div>
  );
};
