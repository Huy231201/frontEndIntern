import React, {useState} from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import {Outlet} from "react-router-dom"



function MainLayout() {
    const [pageTitle, setPageTitle] = useState("");


    const styles = {
        layout: {
            display: "flex",
            width: "100vw",
            height: "100vh",
        },

        sidebar: {
            display: "flex",
            height: "100vh",
            width: "64px",
            backgroundColor: "#008AFF",
            position: "sticky" as const,
            zIndex: 1000,
            top: 0,
        },

        main: {
            flex: 1,
            display: "flex",
            flexDirection: "column" as const,
        },

        topbar: {
            height: "60px",
            backgroundColor: "#008AFF",
            display: "flex",
            alignItems: "center",
            position: "sticky" as const,
            top: 0,
            zIndex: 500,
            flexShrink: 0
        },

        content: {
            flex: 1,
            backgroundColor: "#F1F5F9",
            overflowY: "auto" as const,
            padding: "32px 102px",
        },


        innerLayout: {
            height: "100%",
            borderRadius: "8px",
            backgroundColor: "#fff",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column" as const,
            boxShadow: "0px 4px 2px 0px rgba(0,0,0,0.04), 0px 1px 1px 0px rgba(0,0,0,0,02)"
        }
    } 
      
    return (
        <>
        
        <div style={styles.layout}>
            <div style={styles.sidebar}>
                <Sidebar/>
            </div>
            <div style={styles.main}>
                <div style={styles.topbar}>
                    <Topbar title={pageTitle} />
                </div>

                <main className="content" style={styles.content}>
                    <div style={styles.innerLayout}>
                    <Outlet context={{setPageTitle}}/>
                    </div>
                </main>
            </div>
        </div>

        

        </>
    )
}

export default MainLayout;