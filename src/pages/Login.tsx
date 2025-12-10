import React, { useState } from "react";
import { Typography, Input, Button } from "antd";
import { useAuth } from "../context/authContext";

const { Title, Text } = Typography;

function Login() {
    const [account, setAccount] = useState("");
    const [password, setPassword] = useState("");

    const { login } = useAuth();
    const handleLogin = async () => {
        try {
            await login(account, password);
        } catch (err) {
            alert("Sai tài khoản hoặc mật khẩu");
            throw err
        }
    };

    const styles = {
        container: {
            display: "flex",
            width: "100vw", // Dùng 100% thay cho 100vw
            minHeight: "100vh", // Đảm bảo chiều cao tối thiểu 100% viewport
            margin: "0 auto",
            overflowY: "auto" as const,
        },

        // --- LEFT SIDE --- (Ít thay đổi do mục đích chính là nền/banner)
        left: {
            flex: "0.621",
            backgroundImage: `url("/src/assets/Rectangle 2.png")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative" as const,
            color: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // Sử dụng rem/padding thay cho vh để nội dung không bị 'phồng' quá nhiều
            paddingTop: "4rem", 
            paddingBottom: "3rem",
        },

        content: {
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            textAlign: "center" as const,
            // LOẠI BỎ height cố định (59.86vh) để linh hoạt hơn
            justifyContent: "space-between",
            gap: "3rem", // Dùng rem
            width: "100%"
        },

        logoWrapper: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "6.56rem", // 105px -> 6.56rem (giả sử base font 16px)
            gap: "0.75rem", // 12px -> 0.75rem
        },
        titleGroup: {
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            gap: "2rem", // 32px -> 2rem
            maxWidth: "488px", // Giới hạn width bằng px
        },
        tag: {
            backgroundColor: "#fff",
            color: "rgba(32, 52, 211, 1)",
            borderRadius: "1.5rem", // 24px -> 1.5rem
            padding: "0.75rem 2rem", // 12px 32px -> rem
            fontWeight: 800,
            display: "inline-block",
            height: "3.3rem", // 53px -> 3.3rem
            fontSize: "1.5rem", // 24px -> 1.5rem
        },
        subtitleWrapper: {
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        subtitle: {
            fontSize: "2.875rem", // 46px -> 2.875rem (cho phép co giãn)
            fontWeight: 650,
            lineHeight: "1.4",
            margin: 0,
            color: "rgba(255, 255, 255, 1)",
        },
        footerWrapper: {
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        footer: {
            fontSize: "1.625rem", // 26px -> 1.625rem
            fontWeight: 400,
            color: "rgba(255, 255, 255, 1)",
        },

        // --- RIGHT SIDE ---
        right: {
            flex: "0.379",
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center", // Căn giữa theo chiều ngang
            justifyContent: "center",
            // Dùng padding cố định (px) nhưng chỉ để cân bằng, nội dung sẽ được giới hạn bằng maxWidth
            padding: "3rem", 
            position: "relative" as const,
        },

        formContainer: {
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            justifyContent: "center",
            // LOẠI BỎ width cố định bằng vw và height cố định bằng vh
            width: "100%", 
            maxWidth: "100%", // Giới hạn kích thước tối đa của form
            height: "auto", 
        },

        loginHeader: {
            // Giữ margin bằng rem
            marginBottom: "2rem", // 32px -> 2rem
            textAlign: "center" as const,
            width: "100%",
        },
        loginTitle: {
            fontSize: "2.25rem", // 36px -> 2.25rem
            fontWeight: 600,
            marginBottom: "1.125rem", // 18px -> 1.125rem
            color: "rgba(75, 75, 75, 1)",
        },
        loginSubtitle: {
            fontSize: "1.5rem", // 24px -> 1.5rem
            color: "rgba(75, 75, 75, 1)",
            fontWeight: 400,
        },

        // Form chính
        formWrapper: {
            width: "100%", // Dùng 100% thay cho vw
            display: "flex", 
            flexDirection: "column" as const, 
            gap: "1.75rem", // Dùng rem thay cho vw
        },
        input: {
            height: "3.125rem", // 50px -> 3.125rem
            borderRadius: "0.5rem", // 8px -> 0.5rem
            fontSize: "1rem", // 16px -> 1rem
            padding: "0.8125rem 0.75rem", // 13px 12px -> rem
            fontWeight: "400",
            color: "rgba(148, 163, 184, 1)",
            width: "100%",
        },

        // Nhóm hai nút bên dưới
        buttonGroup: {
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1rem", // 16px -> 1rem
            gap: "1.125rem", // Khoảng 14px (thay cho 1.4vw)
        },
        forgotPassword: {
            flex: 1,
            height: "3.125rem", // 50px -> 3.125rem
            borderRadius: "0.5rem", // 8px -> 0.5rem
            border: "1px solid #E1E1E1",
            backgroundColor: "#fff",
            color: "rgba(75, 75, 75, 1)",
            fontSize: "1rem", // 16px -> 1rem
            fontWeight: 600,
            padding: "0.8125rem 1rem", // Căn chỉnh padding linh hoạt
        },
        button: {
            flex: 1,
            height: "3.125rem", // 50px -> 3.125rem
            backgroundColor: "#FFC62B",
            border: "none",
            borderRadius: "0.5rem", // 8px -> 0.5rem
            fontWeight: 600,
            fontSize: "1rem", // 16px -> 1rem
            color: "#000",
            padding: "0.8125rem 1rem", // Căn chỉnh padding linh hoạt
        },
    };

    return (
        <>
        <div style={styles.container}>
            {/* --- LEFT --- */}
            <div style={styles.left}>
                <div style={styles.content}>
                    <div style={styles.logoWrapper}>
                        <img style={{width: "19rem", height:""}} src="/src/assets/HDBank.png" alt="HDBank" />
                        <img src="/src/assets/X.png" alt="X" />
                        <img src="/src/assets/Group 11.png" alt="GoTrust" />
                    </div>

                    <div style={styles.titleGroup}>
                        <div style={styles.tag}>HỆ THỐNG</div>
                        <div style={styles.subtitleWrapper}>
                            <Title level={2} style={styles.subtitle}>
                                THỐNG KÊ GIAO DỊCH TẠI TRƯỜNG HỌC
                            </Title>
                        </div>
                    </div>

                    <div style={styles.footerWrapper}>
                        <Text style={styles.footer}>Xây dựng bởi HDBank × GoTRUST</Text>
                    </div>
                </div>
            </div>

            {/* --- RIGHT --- */}
            <div style={styles.right} className="right">
                <div style={styles.formContainer}>
                    <div style={styles.loginHeader}>
                        <Title level={3} style={styles.loginTitle}>
                            Chào mừng trở lại
                        </Title>
                        <Text style={styles.loginSubtitle}>Đăng nhập ngay để tiếp tục</Text>
                    </div>

                    <div style={styles.formWrapper}>
                        <Input
                            placeholder="Email công ty"
                            style={styles.input}
                            value={account}
                            onChange={(e) => setAccount(e.target.value)}
                        />
                        <Input.Password
                            placeholder="Mật khẩu"
                            style={styles.input}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <div style={styles.buttonGroup}>
                            <Button style={styles.forgotPassword}>Quên mật khẩu?</Button>
                            <Button onClick={handleLogin} type="primary" style={styles.button}>
                                Đăng nhập
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <style>
            {
                `
                // html {
                // font-size: calc((1.1111vw + 1.5625vh) / 2);
                // }
                `
            }
        </style>
        </>
    );
}

export default Login;



