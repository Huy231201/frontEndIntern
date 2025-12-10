
import {Button, Typography} from 'antd';
import {useAuth} from "../context/authContext"

const {Title} = Typography;

function Topbar({title}: {title: string}) {
    
    const {logout} = useAuth();


    const styles = {
        container: {
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#008AFF",
            padding: "0 102px"
        },

        title: {
            fontSize: "24px",
            fontWeight: 500,
            color: "#F7F9F5"
        },

        rightSection: {
            display: "flex",
            alignItems: "center",
            gap: "12px"
        },

        button: {
            width: "32px",
            height: "32px"
        },

    }

  return (
    <div style={styles.container}>
        {/*Tieu de trang */}
        <Title style={styles.title}>{title}</Title>

        {/*Cac nut */}
        <div style={styles.rightSection}>
        <Button style={styles.button}>
            <img src="/src/assets/Profile.png"/>
        </Button>
        <Button onClick={logout} style={styles.button}>
            <img src="/src/assets/Logout.png"/>
        </Button>
        </div>
    </div>
  );
}
export default Topbar;
