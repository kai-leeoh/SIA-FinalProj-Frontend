import { useState } from "react";
import { Card, Form, Input, Button, Typography, message, Segmented } from "antd";
import { useAuth } from "../context/AuthContext";
import { login, signup } from "../api/authApi";

const { Title } = Typography;

export const AuthPage = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();
  const [form] = Form.useForm();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const token =
        mode === "login"
          ? await login(values.email, values.password)
          : await signup(values.email, values.password);
      setToken(token);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      message.error(detail || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#F7F6F3",
      }}
    >
      <Card
        style={{
          width: 360,
          border: "1px solid #DDD8CE",
          boxShadow: "none",
        }}
      >
        <Title
          level={3}
          className="serif-title"
          style={{ textAlign: "center", marginBottom: 24 }}
        >
          Portfolio Tracker
        </Title>
        <Segmented
          block
          options={[
            { label: "Log In", value: "login" },
            { label: "Sign Up", value: "signup" },
          ]}
          value={mode}
          onChange={(value) => setMode(value as "login" | "signup")}
          style={{ marginBottom: 24 }}
        />
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email", message: "Enter a valid email" }]}
          >
            <Input placeholder="you@example.com" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Enter your password" }]}
          >
            <Input.Password placeholder="••••••••" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              {mode === "login" ? "Log In" : "Sign Up"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};