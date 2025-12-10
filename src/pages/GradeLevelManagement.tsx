import React, { useEffect, useState } from "react";
import { Button, Typography, Modal, Input, Card } from 'antd';
import { useOutletContext} from "react-router-dom";
import {useGrade} from "../context/GradeContext";
import {useClass} from "../context/ClassContext";
import type { GradeLevel } from "../context/GradeContext"
import {createGradeApi, deleteGradeApi, updateGradeApi} from "../api/gradeApi";


const { Title, Text } = Typography;

type ContextType = { setPageTitle: (title: string) => void };

function GradeLevelManagement() {
  // Tạo tiêu đề trên topbar
  const { setPageTitle } = useOutletContext<ContextType>();
  
  useEffect(() => {
    setPageTitle("Quản lý khối");
  }, [setPageTitle]);
  

  // sử dụng Hook Context để lấy grade và setGrade
  const { grade, setGrade } = useGrade();

  // // sử dụng Hook Context để lấy classes
  // const { classes } = useClass();

  // Hàm đếm số lớp theo khối
  // const countClassesByGrade = (gradeID: number) => {
  //   return classes.filter(c => c.gradeID === gradeID).length;
  // }

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel | null>(null);
  const [newGrade, setNewGrade] = useState("");


  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updatedGradeName, setUpdatedGradeName] = useState("");

  

  const [confirmText, setConfirmText] = useState("");

  // state khi hover Card
  const [hoveredCard, setHoveredCard] = useState<string | null>("");


  // Ham  quan ly them khoi
  // const handleAddGrade = () => {
  //   if (!newGrade.trim()) return;
  //   // setGrade([...grade, { name: newGrade, classCount: 0 }]);
  //   // setGrade((prevGrades) => [...prevGrades, {name: newGrade, classCount: 0}]);


  //   setGrade(prev => [
  //   ...prev,
  //   {
  //     id: prev.length ? prev[prev.length - 1].id + 1 : 1,
  //     name: newGrade,
  //     classCount: 0
  //   }
  // ]);

  //   setNewGrade("");
  //   setIsAddModalOpen(false);
  // }

  // Hàm quản lý chỉnh sửa khối
  // const handleUpdateGrade = () => {
  //   if (!selectedGrade || !updatedGradeName.trim()) return;

  //   setGrade(prev =>
  //     prev.map(g =>
  //       g.id === selectedGrade.id? {...g, name: updatedGradeName } : g
  //     )
  //   );

  // setSelectedGrade(null);
  // setUpdatedGradeName("");
  // setIsUpdateModalOpen(false);
  // }
  


  // Ham quan ly xoa khoi 
  // const handleDeleteGrade = () => {
  //   if (!selectedGrade) return;
   

  //   setGrade((prev) => prev.filter((g) => g.id !== selectedGrade.id))
  //   setSelectedGrade(null);
  //   setConfirmText("");
  //   setIsDeleteModalOpen(false);
  // }

  const handleAddGrade = async () => {
    if (!newGrade.trim()) return;

    const generatedCode = (grade.length + 1).toString();

    try {
      // gọi create API
      const response = await createGradeApi(newGrade, generatedCode);

      setGrade(prev => [...prev, response.data]);
      setNewGrade("");
      setIsAddModalOpen(false);
    } catch (err) {
      console.log("Lỗi tạo khối", err);
    }
  }


  const handleDeleteGrade = async () => {
    if (!selectedGrade) return;

    try {
      await deleteGradeApi(selectedGrade.id);

      setGrade(prev => prev.filter(g => g.id !== selectedGrade.id))

      setIsDeleteModalOpen(false);
      setSelectedGrade(null);
      setConfirmText("");

    } catch (err) {
      console.log("Lỗi xóa khối", err);
    }
  }



  const handleUpdateGrade = async () => {
    if (!selectedGrade || !updatedGradeName.trim()) return;;

    try {
      await updateGradeApi(
        selectedGrade.id,
        updatedGradeName,
        selectedGrade.code
      )
      
      setGrade(prev =>
        prev.map(g =>
          g.id === selectedGrade.id? {...g, name: updatedGradeName} : g
        )
      );

      setIsUpdateModalOpen(false);
      setSelectedGrade(null);
    }
    catch (err) {
      console.log("Lỗi chỉnh sửa khối", err);
    }
  }







  

  const styles = {
    gradeLevelContainer: {
      width: "100%",
      height: "60px",
      padding: "10px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid #E2E8F0",
      flexShrink: 0
    },

    gradeLevelHeader: {
      fontWeight: 600,
      fontSize: "18px",
      display: "inline-block"
    },

    addgradeLevelBtn: {
      padding: "8px",
      borderRadius: "8px",
      border: "1px solid #008AFF",
      color: "#008AFF",
      fontSize: "16px",
      fontWeight: 500,
      outline: "none"
    },

    listContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(4,1fr)",
      gap: "12px",
      padding: "14px 24px",
    },

    leftSection: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      flexDirection: "column" as const
    },

    innerLeftSection: {
      display: "flex",
      flexDirection: "row" as const,
      gap: "8px",
      alignItems: "center"
    },

    cardButton: {
      display: "flex",
      alignItems: "flex-end",
      gap: "8px"
    }
  }
  return (
    <>
      <div style={{ height: "100%", display: "flex", flexDirection: "column" as const }}>
        <div style={styles.gradeLevelContainer}>
          <Title style={styles.gradeLevelHeader}>Danh sách khối</Title>
          <Button onClick={() => setIsAddModalOpen(true)} style={styles.addgradeLevelBtn}>Thêm khối</Button>
        </div>

        {/* Danh sách khối*/}
        <div className="cardContentContainer" style={{flex: 1, overflowY: "auto" as const}}>
          <div style={styles.listContainer}>
            {grade.map((grade) =>
            (<Card key={grade.id}
              onMouseEnter={() => setHoveredCard(grade.id)}
              onMouseLeave={() => setHoveredCard(null)}
              bodyStyle={{
                width: "230px",
                display: "flex",
                height: "88px",
                justifyContent: "space-between",
                padding: "16px"
              }}
              style={{
                border: "none",
                boxShadow: hoveredCard === grade.id ? "0px 4px 10px 0px rgba(0,0,0,0.08), 0px 1px 4px 0px rgba(0,0,0,0.04)"  : "0px 1px 1px 0px rgba(0,0,0,0.02), 0px 2px 4px 0px rgba(0,0,0,0.04)"
              }}
            >

              {/*Tên khối + số lớp */}
              <div style={styles.leftSection}>
                <Title style={{ fontWeight: 600, fontSize: "16px" }}>{grade.name}</Title>
                <div style={styles.innerLeftSection}>
                  <img src="/src/assets/home-2.png" />
                  <Text style={{ fontWeight: 500, fontSize: "14px", color: "#94A3B8" }}>
                    {/* {countClassesByGrade(grade.id)} */}
                    {grade.classCount} lớp</Text>
                </div>
              </div>


              {/* 2 nút */}
              <div style={styles.cardButton}>
                <Button 
                onClick={() => {
                  setIsDeleteModalOpen(true);
                  setSelectedGrade(grade);
                }} 
                type="text" 
                style={{outline: "none", width: "40px", height: "40px" }}>
                  <img
                    src="/src/assets/delete.png"
                    alt="Xóa"
                    style={{width: "40px", height: "40px", objectFit: "contain" }}
                  />
                </Button>
                <Button 
                onClick={() => {
                  setIsUpdateModalOpen(true);
                  setSelectedGrade(grade);
                  setUpdatedGradeName(grade.name);
                }}
                type="text" style={{outline: "none", width: "40px", height: "40px" }}>
                  <img
                    src="/src/assets/edit.png"
                    alt="Sửa"
                    style={{outline: "none", width: "40px", height: "40px", objectFit: "contain" }}
                  />
                </Button>
              </div>
            </Card>)
            )
            }
          </div>
        </div>
      </div>

      {/*Modal thêm khối */}
      <Modal
        open={isAddModalOpen}
        footer={null}
        onCancel={() => setIsAddModalOpen(false)}
        width={298}
        centered
        closeIcon={null}
      >
        <div style={{ position: "relative", textAlign: "center" }}>
          <img
            src="/src/assets/modalpic.png"
            width="250"
            height="167"
            style={{ marginBottom: "26px" }}
          />

          <img
            src="/src/assets/primary.png"
            alt="Close"
            onClick={() => setIsAddModalOpen(false)}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "40px",
              height: "40px"
            }}
          />
          <Title style={{ fontWeight: "500", fontSize: "20px", marginBottom: "12px" }} >Thêm khối</Title>
          <Text style={{ fontSize: "16px", fontWeight: 400 }}>Thêm khối và quản lý lớp với khối</Text>
          <Input
            placeholder="Tên khối"
            value={newGrade}
            onChange={(e) => setNewGrade(e.target.value)}
            style={{ marginTop: "26px", borderRadius: "12px", width: "250px", height: "40px" }}
          />
          <Button
            type="primary"
            block
            style={{ marginTop: "26px", borderRadius: "8px", padding: "8px", width: "106px", height: "40px", fontWeight: 500, fontSize: "16px" }}
            onClick={handleAddGrade}
          >
            Thêm khối
          </Button>
        </div>

      </Modal>


      {/* Modal chỉnh sửa khối */}
       <Modal
        open={isUpdateModalOpen}
        footer={null}
        onCancel={() => setIsUpdateModalOpen(false)}
        width={298}
        centered
        closeIcon={null}
      >
        <div style={{ position: "relative", textAlign: "center" }}>
          <img
            src="/src/assets/modalpic.png"
            width="250"
            height="167"
            style={{ marginBottom: "26px" }}
          />

          <img
            src="/src/assets/primary.png"
            alt="Close"
            onClick={() => setIsUpdateModalOpen(false)}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "40px",
              height: "40px"
            }}
          />
          <Title style={{ fontWeight: "500", fontSize: "20px", marginBottom: "12px" }} >Thêm khối</Title>
          <Text style={{ fontSize: "16px", fontWeight: 400 }}>Thêm khối và quản lý lớp với khối</Text>
          <Input
            placeholder="Tên khối"
            value={updatedGradeName}
            onChange={(e) => setUpdatedGradeName(e.target.value)}
            style={{ marginTop: "26px", borderRadius: "12px", width: "250px", height: "40px" }}
          />
          <Button
            type="primary"
            block
            style={{ marginTop: "26px", borderRadius: "8px", padding: "8px", width: "106px", height: "40px", fontWeight: 500, fontSize: "16px" }}
            onClick={handleUpdateGrade}
          >
            Cập nhật
          </Button>
        </div>

      </Modal>



      {/*Modal xóa khối */}
      <Modal
        open={isDeleteModalOpen}
        footer={null}
        width={335}
        centered
        closeIcon={null}
      >
        <div style={{ width: "287px", position: "relative", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
          <img src="/src/assets/Illustration.png"
            style={{
              width: "250px",
              height: "186.28px",
              marginBottom: "18px"
            }}
          />

          <img src="/src/assets/primary.png"
            alt="Xoa"
            onClick={() => setIsDeleteModalOpen(false)}
            style={{
              position: "absolute",
              width: "40px",
              height: "40px",
              top: 0,
              right: 0
            }}
          />


          <Title style={{ fontWeight: 500, fontSize: "20px", marginBottom: "12px" }}>
            Xác nhận xóa khối
          </Title>

          <Text style={{ fontWeight: 400, fontSize: "16px", marginBottom: "12px", lineHeight: "100%" }}>
            Toàn bộ dữ liệu sẽ bị xóa <br />và không thể khôi phục
          </Text>
          <Input
            placeholder="Nhập XACNHAN để xác nhận xóa khối"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            style={{
              marginTop: "12px",
              borderRadius: "12px",
              fontWeight: 400,
              fontSize: "16px",
              color: "#94A3B8",
              height: "40px"
            }}
          />
          <div style={{ display: "flex", justifyContent: "center", marginTop: "18px", width: "230px" }}>
            <Button
              style={{ backgroundColor: "#F1F5F9", fontWeight: 500, fontSize: "16px", color: "#334155", borderRadius: "8px", height: "40px", width: "106px", marginRight: "18px" }}
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Hủy thao tác
            </Button>

            <Button
              style={{ backgroundColor: "#FFEBEE", fontWeight: 500, fontSize: "16px", color: "#EC2D30", borderRadius: "8px", height: "40px", width: "106px" }}
              onClick={handleDeleteGrade}
              danger
              disabled={confirmText !== "XACNHAN"}
            >
              Xóa bỏ
            </Button>
          </div>
        </div>
      </Modal>


      <style>
        {
          `.cardContentContainer::-webkit-scrollbar {
            display: none
          }

          .ant-modal-content {
            padding: 24px !important;
            border-radius: 12px !important;
          }

          body::-webkit-scrollbar {
            display: none;
         }
          `
        }
      </style>
    </>
  );
}

export default GradeLevelManagement;