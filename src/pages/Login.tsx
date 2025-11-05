
import { Typography, Input, Button } from "antd";


const { Title, Text } = Typography;

function Login() {
    const styles = {
        container: {
            display: "flex",
            width: "100vw",
            height: "100vh",
            margin: "0 auto",
        },

        // --- LEFT SIDE ---
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
            paddingTop: "21.34vh",
            paddingBottom: "18.79vh"
        },

        content: {
            //   marginTop: "218.46px",
            //   marginBottom: "192.54px",
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            textAlign: "center" as const,
            height: "59.86vh",
            justifyContent: "space-between"
        },


        logoWrapper: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "105px",
            gap: "12px",
        },
        titleGroup: {
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            gap: "32px",
            width: "488px",
            height: "199px",
        },
        tag: {
            backgroundColor: "#fff",
            color: "rgba(32, 52, 211, 1)",
            borderRadius: "24px",
            padding: "12px 32px",
            fontWeight: 800,
            display: "inline-block",
            height: "53px",
            fontSize: "24px",
        },
        subtitleWrapper: {
            width: "488px",
            height: "114px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        subtitle: {
            fontSize: "46px",
            fontWeight: 650,
            lineHeight: "1.4",
            margin: 0,
            color: "rgba(255, 255, 255, 1)",
        },
        footerWrapper: {
            width: "399px",
            height: "33px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        },
        footer: {
            fontSize: "26px",
            fontWeight: 400,
            color: "rgba(255, 255, 255, 1)",
        },

        // --- RIGHT SIDE ---

        right: {
            flex: "0.379",
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "3.28vh",
            position: "relative" as const,

            padding: "0 16px"
        },

        formContainer: {
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            justifyContent: "center",
            width: "450px",
            maxWidth: "100%",
            height: "19.14vh"
        },

        // Header cách top 364px
        loginHeader: {
            marginLeft: "48px",
            marginRight: "48px",
            marginBottom: "32px",
            textAlign: "center" as const,
            width: "100%",
        },
        loginTitle: {
            fontSize: "36px",
            fontWeight: 600,
            marginBottom: "18px",
            color: "rgba(75, 75, 75, 1)",
        },
        loginSubtitle: {
            fontSize: "24px",
            color: "rgba(75, 75, 75, 1)",
            fontWeight: 400,
        },

        // Form chính
        formWrapper: {
            display: "flex",
            flexDirection: "column" as const,
            width: "31.25vw",
            gap: "16px"
        },
        input: {
            height: "50px",
            borderRadius: "8px",
            fontSize: "16px",
            padding: "13px 12px",
            fontWeight: "400px",
            color: "rgba(148, 163, 184, 1)"
        },

        // Nhóm hai nút bên dưới
        buttonGroup: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "16px",
            gap: "18px"
        },
        forgotPassword: {
            width: "16vw",
            height: "50px",
            borderRadius: "8px",
            border: "1px solid #E1E1E1",
            backgroundColor: "#fff",
            color: "rgba(75, 75, 75, 1)",
            fontSize: "16px",
            fontWeight: 600,
            padding: "13px 50px",
        },
        button: {
            width: "16vw",
            height: "50px",
            backgroundColor: "#FFC62B",
            border: "none",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "16px",
            color: "#000",
            padding: "13px 50px"
        },
    };

    return (
        <div style={styles.container}>
            {/* --- LEFT --- */}
            <div style={styles.left}>
                <div style={styles.content}>
                    <div style={styles.logoWrapper}>
                        <img src="/src/assets/HDBank.png" alt="HDBank" />
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
            <div style={styles.right}>
                <div style={styles.formContainer}>
                    <div style={styles.loginHeader}>
                        <Title level={3} style={styles.loginTitle}>
                            Chào mừng trở lại
                        </Title>
                        <Text style={styles.loginSubtitle}>Đăng nhập ngay để tiếp tục</Text>
                    </div>

                    <div style={styles.formWrapper}>
                        <Input placeholder="Email công ty" style={styles.input} />
                        <Input.Password placeholder="Mật khẩu" style={styles.input} />

                        <div style={styles.buttonGroup}>
                            <Button style={styles.forgotPassword}>Quên mật khẩu?</Button>
                            <Button type="primary" style={styles.button}>
                                Đăng nhập
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;

// import { Typography, Input, Button } from "antd";

// const { Title, Text } = Typography;

// function Login() {
//     const styles = {
//         container: {
//             display: "flex",
//             width: "100vw",
//             height: "100vh",
//             margin: "0 auto",
//         },

//         // --- LEFT SIDE ---
//         left: {
//             flex: "0.621",
//             backgroundImage: `url("/src/assets/Rectangle 2.png")`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             position: "relative" as const,
//             color: "#fff",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             paddingTop: "21.34vh",
//             paddingBottom: "18.79vh"
//         },

//         content: {
//             //   marginTop: "218.46px",
//             //   marginBottom: "192.54px",
//             display: "flex",
//             flexDirection: "column" as const,
//             alignItems: "center",
//             textAlign: "center" as const,
//             height: "59.86vh",
//             justifyContent: "space-between"
//         },


//         logoWrapper: {
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             height: "105px",
//             gap: "12px",
//         },
//         titleGroup: {
//             display: "flex",
//             flexDirection: "column" as const,
//             alignItems: "center",
//             gap: "32px",
//             width: "488px",
//             height: "199px",
//         },
//         tag: {
//             backgroundColor: "#fff",
//             color: "rgba(32, 52, 211, 1)",
//             borderRadius: "24px",
//             padding: "12px 32px",
//             fontWeight: 800,
//             display: "inline-block",
//             height: "53px",
//             fontSize: "24px",
//       },
//         subtitleWrapper: {
//             width: "488px",
//             height: "114px",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//         },
//         subtitle: {
//             fontSize: "46px",
//             fontWeight: 650,
//             lineHeight: "1.4",
//             margin: 0,
//             color: "rgba(255, 255, 255, 1)",
//         },
//         footerWrapper: {
//             width: "399px",
//             height: "33px",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//         },
//         footer: {
//             fontSize: "26px",
//             fontWeight: 400,
//             color: "rgba(255, 255, 255, 1)",
//         },

//         // --- RIGHT SIDE ---

//         right: {
//             flex: "0.379",
//             backgroundColor: "#fff",
//             display: "flex",
//             flexDirection: "column" as const,
//             alignItems: "center",
//             justifyContent: "center",
//             paddingTop: "3.28vh",
//             position: "relative" as const
//         },

//         // **ĐÃ XÓA `formContainer` KHỎI ĐÂY**

//         // Header cách top 364px
//         loginHeader: {
//             marginLeft: "48px",
//             marginRight: "48px",
//             marginBottom: "32px",
//             textAlign: "center" as const,
//             width: "450px",
//         },
//         loginTitle: {
//             fontSize: "36px",
//             fontWeight: 600,
//             marginBottom: "18px",
//             color: "rgba(75, 75, 75, 1)",
//         },
//         loginSubtitle: {
//             fontSize: "24px",
//             color: "rgba(75, 75, 75, 1)",
//             fontWeight: 400,
//         },

//         // Form chính
//         formWrapper: {
//             display: "flex",
//             flexDirection: "column" as const,
//             width: "450px",
//             gap: "16px"
//         },
//         input: {
//             height: "50px",
//             borderRadius: "8px",
//             fontSize: "16px",
//             padding: "13px 12px",
//             fontWeight: "400px",
//             color: "rgba(148, 163, 184, 1)"
//         },

//         // Nhóm hai nút bên dưới
//         buttonGroup: {
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             marginTop: "16px",
//         },
//         forgotPassword: {
//             width: "216px",
//             height: "50px",
//             borderRadius: "8px",
//             border: "1px solid #E1E1E1",
//             backgroundColor: "#fff",
//             color: "rgba(75, 75, 75, 1)",
//             fontSize: "16px",
//             fontWeight: 600,
//             padding: "13px 50px"
//         },
//         button: {
//             width: "216px",
//             height: "50px",
//             backgroundColor: "#FFC62B",
//             border: "none",
//             borderRadius: "8px",
//             fontWeight: 600,
//             fontSize: "16px",
//             color: "#000",
//             padding: "13px 50px"
//         },
//     };

//     return (
//         <div style={styles.container}>
//             {/* --- LEFT --- */}
//             <div style={styles.left}>
//                 <div style={styles.content}>
//                     <div style={styles.logoWrapper}>
//                         <img src="/src/assets/HDBank.png" alt="HDBank" />
//                         <img src="/src/assets/X.png" alt="X" />
//                         <img src="/src/assets/Group 11.png" alt="GoTrust" />
//                     </div>

//                     <div style={styles.titleGroup}>
//                         <div style={styles.tag}>HỆ THỐNG</div>
//                         <div style={styles.subtitleWrapper}>
//                             <Title level={2} style={styles.subtitle}>
//                                 THỐNG KÊ GIAO DỊCH TẠI TRƯỜNG HỌC
//                             </Title>
//                      </div>
//                     </div>

//                     <div style={styles.footerWrapper}>
//                         <Text style={styles.footer}>Xây dựng bởi HDBank × GoTRUST</Text>
//                 _   </div>
//                 </div>
//             </div>

//             {/* --- RIGHT --- */}
//             <div style={styles.right}>
//                 
//                 {/* **ĐÃ XÓA `div formContainer` BỌC BÊN NGOÀI** */}

//                 <div style={styles.loginHeader}>
//                     <Title level={3} style={styles.loginTitle}>
//                         Chào mừng trở lại
//                     </Title>
//                     <Text style={styles.loginSubtitle}>Đăng nhập ngay để tiếp tục</Text>
//                 </div>

//                 <div style={styles.formWrapper}>
//                     
//                     {/* **ĐÃ SỬA PLACEHOLDER** */}
//                     <Input placeholder="Email đăng nhập" style={styles.input} />
//                     <Input.Password placeholder="Mật khẩu" style={styles.input} />

//                     <div style={styles.buttonGroup}>
//                         <Button style={styles.forgotPassword}>Quên mật khẩu?</Button>
//                         <Button type="primary" style={styles.button}>
//                             Đăng nhập
//                         </Button>
//                     </div>
//                 </div>
//             
//             </div>
//         </div>
//     );
// }

// export default Login;


