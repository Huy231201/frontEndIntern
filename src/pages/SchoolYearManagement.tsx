
// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Button, Typography, Table, Modal, DatePicker, Pagination, Dropdown, Menu } from 'antd';
// import { useOutletContext } from "react-router-dom";
// import { CalendarOutlined } from "@ant-design/icons";
// import { useSchoolYear } from "../context/SchoolYearContext";
// import { useClass } from "../context/ClassContext";

// const { Title, Text } = Typography;
// const { RangePicker } = DatePicker;

// type ContextType = { setPageTitle: (title: string) => void };

// function SchoolYearManagement() {

//   /* -------------------------------------------------------------------------- */
//   /*                              STATE & CONTEXT                               */
//   /* -------------------------------------------------------------------------- */

//   const { setPageTitle } = useOutletContext<ContextType>();

//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//   const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

//   // const [startYear, setStartYear] = useState<any>(null);

//   // const [endYear, setEndYear] = useState<any>(null);
//   // const [sortInfo, setSortInfo] = useState<{ columnKey: string; order: "ascend" | "descend" | null }>({
//   //   columnKey: "",
//   //   order: null
//   // });

//   // const [deleteYear, setDeleteYear] = useState<number | null>(null);
//   // const { classes } = useClass();

//   const {schoolYear} = useSchoolYear();
  

//   const [currentPage, setCurrentPage] = useState(1);
//   const [dataSizeState, setDataSizeState] = useState(10);
//   const dataSize = dataSizeState;

//   const [goToPage, setGoToPage] = useState<number | null>(null);

  

//   /* -------------------------------------------------------------------------- */
//   /*                                      UI                                    */
//   /* -------------------------------------------------------------------------- */

//   useEffect(() => {
//     setPageTitle("Quản lý niên khóa");
//   }, [setPageTitle]);

//   /* -------------------------------------------------------------------------- */
//   /*                          DERIVED DATA (SORT, PAGING)                       */
//   /* -------------------------------------------------------------------------- */

//   const total = schoolYear.length;
//   const start = (currentPage - 1) * dataSize + 1;
//   const end = Math.min(currentPage * dataSize, total);

//   // const countClassesBySchoolYear = (yearid: number) => {
//   //   return classes.filter(c => c.schoolYearID === yearid).length;
//   // };

//   // const sortedYears = [...schoolYears].sort((a, b) => {
//   //   if (!sortInfo.order) return 0;

//   //   if (sortInfo.columnKey === "year") {
//   //     const startA = Number(a.year.split(" - ")[0]);
//   //     const startB = Number(b.year.split(" - ")[0]);

//   //     if (startA !== startB) {
//   //       return sortInfo.order === "ascend" ? startA - startB : startB - startA;
//   //     }

//   //     const endA = Number(a.year.split(" - ")[1]);
//   //     const endB = Number(b.year.split(" - ")[1]);

//   //     return sortInfo.order === "ascend" ? endA - endB : endB - endA;
//   //   }

//   //   if (sortInfo.columnKey === "classCount") {
//   //     const countA = countClassesBySchoolYear(a.id);
//   //     const countB = countClassesBySchoolYear(b.id);

//   //     return sortInfo.order === "ascend" ? countA - countB : countB - countA;
//   //   }

//   //   return 0;
//   // });

//   // const currentData = schoolYear.slice(start - 1, end);

//   const dataSource = schoolYear.map((year, index) => ({
//   key: index + 1,
//   year: year.replace("-"," - ")
//   }));


//   const pageSizeMenu = (
//     <Menu
//       onClick={({ key }) => handleDataSizeChange(Number(key))}
//       items={[
//         { label: "5 dữ liệu / trang", key: 5 },
//         { label: "10 dữ liệu / trang", key: 10 },
//         { label: "15 dữ liệu / trang", key: 15 },
//         { label: "20 dữ liệu / trang", key: 20 }
//       ]}
//     />
//   );

//   /* -------------------------------------------------------------------------- */
//   /*                                   HANDLERS                                 */
//   /* -------------------------------------------------------------------------- */

//   // const handleAddYear = () => {
//   //   if (!startYear || !endYear) return;

//   //   const nextId = schoolYears.length > 0 ? Math.max(...schoolYears.map(y => y.id)) + 1 : 1;

//   //   const newYear: SchoolYear = {
//   //     id: nextId,
//   //     year: `${startYear.year()} - ${endYear.year()}`,
//   //   };

//   //   setSchoolYears(prev => [...prev, newYear]);

//   //   setStartYear(null);
//   //   setEndYear(null);
//   //   setIsAddModalOpen(false);
//   // };

//   // const handleDeleteYear = () => {
//   //   if (deleteYear === null) return;
//   //   setSchoolYears(prev => prev.filter(year => year.id !== deleteYear));
//   //   setDeleteYear(null);
//   //   setIsDeleteModalOpen(false);
//   // };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleDataSizeChange = (value: number) => {
//     setDataSizeState(value);
//     setCurrentPage(1);
//   };


//   // Hàm đếm số lớp theo một niên khóa
// const getClassCountBySchoolYear = async (schoolYear: string) => {
//     const token = localStorage.getItem("token");

//     try {
//         const response = await axios.get(
//             `https://api-dev.gotrust.vn/edupay/v1/classes?SchoolYear=${schoolYear}`,
//             {
//                 headers: {
//                     "accept": "text/plain",
//                     "x-api-version": "1.0",
//                     "Authorization": `Bearer ${token}`
//                 }
//             }
//         );

//         // API trả về mảng lớp => lấy length
//         return response.data.length;

//     } catch (err) {
//         console.error("Lỗi khi đếm số lớp theo niên khóa:", err);
//         return 0; // cho an toàn UI không bị crash
//     }
// };



//   /* -------------------------------------------------------------------------- */
//   /*                                 TABLE COLUMNS                              */
//   /* -------------------------------------------------------------------------- */

//   const columns = [
//     {
//       title: (
//         <span style={{ fontSize: "14px", fontWeight: 600 }}>Hành động</span>
//       ),
//       key: "action",
//       width: "33.33%",

//       render: (_: any) => (
//         <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
//           <Button
//             onClick={() => {
//               // setDeleteYear(record.id);
//               setIsDeleteModalOpen(true);
//             }}
//             style={{ outline: "none", width: "40px", height: "32px", borderRadius: "8px", padding: 0 }}
//           >
//             <img
//               src="/src/assets/delete.png"
//               alt="Xóa"
//               style={{ width: "40px", height: "32px", objectFit: "cover", borderRadius: "8px" }}
//             />
//           </Button>

//           <Button style={{ outline: "none", width: "40px", height: "32px", borderRadius: "8px", padding: 0 }}>
//             <img
//               src="/src/assets/edit.png"
//               alt="Sửa"
//               style={{ width: "40px", height: "32px", objectFit: "cover", borderRadius: "8px" }}
//             />
//           </Button>
//         </div>
//       )
//     },

//     {
//       title: (
//         <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
//           <span style={{ fontSize: "14px", fontWeight: 600 }}>Niên khóa</span>
//           <img
//             src="/src/assets/active.png"
//             style={{ height: "14px", width: "14px" }}
//             onClick={() => {
//               // setSortInfo(prev => ({
//               //   columnKey: "year",
//               //   order:
//               //     prev.columnKey === "year"
//               //       ? prev.order === "ascend"
//               //         ? "descend"
//               //         : prev.order === "descend"
//               //           ? null
//               //           : "ascend"
//               //       : "ascend"
//               // }));
//             }}
//           />
//         </div>
//       ),
//       width: "33.33%",
//       dataIndex: "year",
//       key: "year",
//       render: (text: string) => (
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <Text
//             style={{
//               fontWeight: 400,
//               fontSize: "14px",
//               color: "#008AFF"
//             }}
//           >
//             {text}
//           </Text>
//         </div>
//       )
//     },

//     {
//       title: (
//         <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
//           <span style={{ fontSize: "14px", fontWeight: 600 }}>Số lượng lớp thuộc niên khóa</span>
//           <img
//             src="/src/assets/active.png"
//             style={{ height: "14px", width: "14px" }}
//             onClick={() => {
//               // setSortInfo(prev => ({
//               //   columnKey: "classCount",
//               //   order:
//               //     prev.columnKey === "classCount"
//               //       ? prev.order === "ascend"
//               //         ? "descend"
//               //         : prev.order === "descend"
//               //           ? null
//               //           : "ascend"
//               //       : "ascend"
//               // }));
//             }}
//           />
//         </div>
//       ),
//       width: "33.33%",
//       key: "classCount",
//       render: (_: any) => (
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <Text style={{ fontWeight: 400, fontSize: "14px" }}>
//              lớp
//           </Text>
//         </div>
//       )
//     }
//   ];

//   /* -------------------------------------------------------------------------- */
//   /*                                   STYLES                                   */
//   /* -------------------------------------------------------------------------- */

//   const styles = {
//     schoolYearContainer: {
//       width: "100%",
//       height: "60px",
//       padding: "10px 24px",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       borderBottom: "1px solid #E2E8F0",
//       flexShrink: 0
//     },

//     schoolYearHeader: {
//       fontWeight: 600,
//       fontSize: "18px",
//       display: "inline-block"
//     },

//     addYearBtn: {
//       padding: "8px",
//       borderRadius: "8px",
//       border: "1px solid #008AFF",
//       color: "#008AFF",
//       fontSize: "16px",
//       fontWeight: 500,
//       outline: "none"
//     },

//     mainContentContainer: {
//       display: "flex",
//       flexDirection: "column" as const,
//       flex: 1,
//       minHeight: 0
//     },

//     paginationContainer: {
//       width: "100%",
//       height: "56px",
//       padding: "0 24px",
//       display: "flex",
//       justifyContent: "space-between",
//       alignItems: "center",
//       boxShadow: "0px 8px 32px 0px rgba(0, 0, 0, 0.08)",
//       flexShrink: 0
//     }
//   };

//   /* -------------------------------------------------------------------------- */
//   /*                                 MAIN RETURN                                */
//   /* -------------------------------------------------------------------------- */

//   return (
//     <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
//       <div style={styles.schoolYearContainer}>
//         <Title style={styles.schoolYearHeader}>Danh sách niên khóa</Title>
//         <Button onClick={() => setIsAddModalOpen(true)} style={styles.addYearBtn}>
//           Thêm niên khóa
//         </Button>
//       </div>

//       <div style={styles.mainContentContainer}>
//         <div className="tableContent" style={{ flex: 1, overflowY: "auto" as const }}>
//           <Table
//             scroll={{ x: 900 }}
//             dataSource={dataSource}
//             columns={columns}
//             rowKey="id"
//             pagination={false}
//             components={{
//               header: {
//                 cell: (props) => <th {...props} style={{ height: "48px", padding: "0 16px" }} />
//               },
//               body: {
//                 cell: (props) => <td {...props} style={{ padding: "0 16px", height: "48px" }} />
//               }
//             }}
//           />
//         </div>

//         <div style={styles.paginationContainer}>
//           <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
//             <Text style={{ color: "#94A3B8", fontSize: "14px", fontWeight: 400 }}>
//               {start} - {end} trên tổng {total}
//             </Text>

//             <Text style={{ color: "#94A3B8", fontSize: "14px", fontWeight: 400 }}>
//               {dataSize} dữ liệu / trang
//             </Text>

//             <Dropdown overlay={pageSizeMenu} trigger={['click']}>
//               <img src="/src/assets/Down.png" style={{ height: "14px", width: "14px" }} />
//             </Dropdown>
//           </div>

//           <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
//             <Pagination
//               current={currentPage}
//               pageSize={dataSize}
//               total={total}
//               onChange={handlePageChange}
//               showSizeChanger={false}
//               showQuickJumper={false}
//             />

//             <Text style={{ color: "#94A3B8", fontSize: "14px", fontWeight: 400 }}>Đến trang</Text>

//             <input
//               type="number"
//               value={goToPage ?? ""}
//               onChange={(e) => {
//                 const value = e.target.value;
//                 setGoToPage(value === "" ? null : Number(value));
//               }}
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && goToPage !== null) {
//                   const maxPage = Math.ceil(total / dataSize);
//                   const page = Math.max(1, Math.min(goToPage, maxPage));
//                   setCurrentPage(page);
//                 }
//               }}
//               style={{
//                 fontSize: "14px",
//                 width: "50px",
//                 height: "28px",
//                 border: "1px solid #E1E1E1",
//                 borderRadius: "4px",
//                 paddingLeft: "8px",
//                 outline: "none"
//               }}
//             />
//           </div>
//         </div>
//       </div>

//       {/* ADD MODAL */}
//       <Modal
//         open={isAddModalOpen}
//         footer={null}
//         centered
//         closeIcon={null}
//         width={364}
//         styles={{ content: { padding: 32 } }}
//       >
//         <div
//           style={{
//             width: "300px",
//             position: "relative",
//             display: "flex",
//             alignItems: "center",
//             flexDirection: "column" as const
//           }}
//         >
//           <img src="/src/assets/modalpic.png" style={{ width: "100%", height: "200px" }} />
//           <img
//             src="/src/assets/primary.png"
//             onClick={() => setIsAddModalOpen(false)}
//             style={{ position: "absolute", width: "40px", height: "40px", top: 25, right: 25 }}
//           />

//           <Title style={{ marginTop: "18px", fontWeight: 500, fontSize: "20px", color: "#334155" }}>
//             Tạo niên khóa
//           </Title>

//           <Text style={{ textAlign: "center", marginTop: "12px", color: "#334155" }}>
//             Chọn năm bắt đầu và kết thúc của <br /> của niên khóa
//           </Text>

//           <RangePicker
//             picker="year"
//             placeholder={['Từ năm', 'Đến năm']}
//             suffixIcon={null}
//             prefix={<CalendarOutlined style={{ width: "13.33px", height: "13.33px", color: "#94A3B8", marginRight: "5.33px" }} />}
//             // onChange={(values) => {
//             //   setStartYear(values?.[0] || null);
//             //   setEndYear(values?.[1] || null);
//             // }}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 // handleAddYear();
//               }
//             }}
//             style={{
//               width: "100%",
//               marginTop: "26px",
//               fontWeight: 400,
//               fontSize: "16px",
//               height: "40px"
//             }}
//           />

//           <Button
//             // onClick={handleAddYear}
//             style={{
//               backgroundColor: "#F2F9FF",
//               margin: "32px 0 12px",
//               width: "100%",
//               color: "#008AFF",
//               borderRadius: "8px",
//               height: "40px",
//               fontWeight: 500,
//               fontSize: "16px"
//             }}
//           >
//             Tạo niên khóa
//           </Button>
//         </div>
//       </Modal>

//       {/* DELETE MODAL */}
//       <Modal
//         open={isDeleteModalOpen}
//         footer={null}
//         centered
//         closeIcon={null}
//         width={364}
//         styles={{ content: { padding: 32 } }}
//       >
//         <div
//           style={{
//             width: "300px",
//             position: "relative",
//             display: "flex",
//             alignItems: "center",
//             flexDirection: "column" as const
//           }}
//         >
//           <img src="/src/assets/Illustration.png" style={{ width: "100%", height: "223.54px" }} />
//           <img
//             src="/src/assets/primary.png"
//             onClick={() => setIsDeleteModalOpen(false)}
//             style={{ position: "absolute", width: "40px", height: "40px", top: 25, right: 25 }}
//           />

//           <Title style={{ marginTop: "18px", fontWeight: 500, fontSize: "20px", color: "#334155" }}>
//             Xác nhận xóa niên khóa
//           </Title>

//           <Text style={{ marginTop: "12px", fontWeight: 400, fontSize: "16px", color: "#334155" }}>
//             Niên khóa sẽ bị xóa và không thể khôi phục
//           </Text>

//           <Button
//             // onClick={handleDeleteYear}
//             style={{
//               marginTop: "24px",
//               marginBottom: "12px",
//               height: "40px",
//               width: "100%",
//               fontWeight: 500,
//               fontSize: "16px",
//               borderRadius: "8px",
//               backgroundColor: "#FFFBFB",
//               color: "#f52933"
//             }}
//           >
//             Xóa niên khóa
//           </Button>
//         </div>
//       </Modal>

//       {/* EXTRA CSS */}
//       <style>
//         {`
//           input[type="number"]::-webkit-inner-spin-button,
//           input[type="number"]::-webkit-outer-spin-button {
//             -webkit-appearance: none;
//             margin: 0;
//           }

//           input[type="number"] {
//             -moz-appearance: textfield;
//           }

//           .ant-pagination-item a {
//             color: #64748B !important
//           }

//           .ant-pagination-item-active a {
//             color: #008AFF !important;
//           }

//           .ant-pagination-item-active {
//             background-color: #f2f9ff !important;
//             border: none !important
//           }

//           .tableContent::-webkit-scrollbar {
//             display: none
//           }

//           .ant-table-thead > tr > th::before {
//             display: none !important
//           }

//           body::-webkit-scrollbar {
//             display: none;
//           }
//         `}
//       </style>
//     </div>
//   );
// }

// export default SchoolYearManagement;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Typography, Table, Modal, DatePicker, Pagination, Dropdown, Menu } from 'antd';
import { useOutletContext } from "react-router-dom";
import { CalendarOutlined } from "@ant-design/icons";
import { useSchoolYear } from "../context/SchoolYearContext";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

type ContextType = { setPageTitle: (title: string) => void };

function SchoolYearManagement() {

  /* -------------------------------------------------------------------------- */
  /*                              STATE & CONTEXT                               */
  /* -------------------------------------------------------------------------- */

  const { setPageTitle } = useOutletContext<ContextType>();
  const { schoolYear } = useSchoolYear();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [dataSizeState, setDataSizeState] = useState(10);
  const dataSize = dataSizeState;

  const [goToPage, setGoToPage] = useState<number | null>(null);

  /*  LƯU SỐ LỚP THEO NIÊN KHÓA */
  const [classCounts, setClassCounts] = useState<{ [key: string]: number }>({});

  /* -------------------------------------------------------------------------- */
  /*                                     UI                                     */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    setPageTitle("Quản lý niên khóa");
  }, [setPageTitle]);

  /* -------------------------------------------------------------------------- */
  /*                       GỌI API ĐẾM SỐ LỚP THEO NIÊN KHÓA                    */
  /* -------------------------------------------------------------------------- */

  const getClassCountBySchoolYear = async (schoolYear: string) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `https://api-dev.gotrust.vn/edupay/v1/classes?SchoolYear=${schoolYear}`,
        {
          headers: {
            "accept": "text/plain",
            "x-api-version": "1.0",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      return response.data.data.length; // API trả mảng => length
    } catch (err) {
      console.error("Lỗi khi đếm số lớp:", err);
      return 0;
    }
  };

  /*  KHI LOAD SCHOOLYEAR → TỰ ĐỘNG ĐẾM SỐ LỚP */
  useEffect(() => {
    const loadCounts = async () => {
      const results: { [key: string]: number } = {};

      for (const year of schoolYear) {
        const count = await getClassCountBySchoolYear(year);
        results[year] = count;
      }

      setClassCounts(results);
    };

    if (schoolYear.length > 0) {
      loadCounts();
    }
  }, [schoolYear]);

  /* -------------------------------------------------------------------------- */
  /*                           PAGING & DERIVED DATA                            */
  /* -------------------------------------------------------------------------- */

  const total = schoolYear.length;
  const start = total === 0 ? 0: (currentPage - 1) * dataSize + 1;
  const end = total === 0? 0:  Math.min(currentPage * dataSize, total);

  const dataSource = schoolYear.map((year, index) => ({
    key: index + 1,
    year: year.replace("-", " - "),
    classCount: classCounts[year] ?? 0
  }));

  /* -------------------------------------------------------------------------- */
  /*                                   HANDLERS                                 */
  /* -------------------------------------------------------------------------- */

  // Hàm chuyển trang trên Pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  // Hàm chọn số dòng mỗi trang
  const handleDataSizeChange = (value: number) => {
    setDataSizeState(value);
    setCurrentPage(1);
  };

  const pageSizeMenu = (
    <Menu
      onClick={({ key }) => handleDataSizeChange(Number(key))}
      items={[
        { label: "5 dữ liệu / trang", key: 5 },
        { label: "10 dữ liệu / trang", key: 10 },
        { label: "15 dữ liệu / trang", key: 15 },
        { label: "20 dữ liệu / trang", key: 20 }
      ]}
    />
  );

  /* -------------------------------------------------------------------------- */
  /*                                 TABLE COLUMNS                              */
  /* -------------------------------------------------------------------------- */

  const columns = [
    {
      title: (
        <span style={{ fontSize: "14px", fontWeight: 600 }}>Hành động</span>
      ),
      key: "action",
      width: "33.33%",
      render: () => (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Button
            onClick={() => setIsDeleteModalOpen(true)}
            style={{ outline: "none", width: "40px", height: "32px", borderRadius: "8px", padding: 0 }}
          >
            <img
              src="/src/assets/delete.png"
              style={{ width: "40px", height: "32px", objectFit: "cover", borderRadius: "8px" }}
            />
          </Button>

          <Button style={{ outline: "none", width: "40px", height: "32px", borderRadius: "8px", padding: 0 }}>
            <img
              src="/src/assets/edit.png"
              style={{ width: "40px", height: "32px", objectFit: "cover", borderRadius: "8px" }}
            />
          </Button>
        </div>
      )
    },

    {
      title: (
        <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
          <span style={{ fontSize: "14px", fontWeight: 600 }}>Niên khóa</span>
          <img src="/src/assets/active.png" style={{ height: "14px", width: "14px" }} />
        </div>
      ),
      width: "33.33%",
      dataIndex: "year",
      key: "year",
      render: (text: string) => (
        <Text style={{ fontWeight: 400, fontSize: "14px", color: "#008AFF" }}>{text}</Text>
      )
    },

    {
      title: (
        <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
          <span style={{ fontSize: "14px", fontWeight: 600 }}>Số lượng lớp thuộc niên khóa</span>
          <img src="/src/assets/active.png" style={{ height: "14px", width: "14px" }} />
        </div>
      ),
      width: "33.33%",
      dataIndex: "classCount",
      key: "classCount",
      render: (count: number) => (
        <Text style={{ fontWeight: 400, fontSize: "14px" }}>{count} lớp</Text>
      )
    }
  ];

  /* -------------------------------------------------------------------------- */
  /*                                   STYLES                                   */
  /* -------------------------------------------------------------------------- */

  const styles = {
    schoolYearContainer: {
      width: "100%",
      height: "60px",
      padding: "10px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid #E2E8F0",
      flexShrink: 0
    },

    schoolYearHeader: {
      fontWeight: 600,
      fontSize: "18px"
    },

    addYearBtn: {
      padding: "8px",
      borderRadius: "8px",
      border: "1px solid #008AFF",
      color: "#008AFF",
      fontSize: "16px",
      fontWeight: 500,
      outline: "none"
    },

    mainContentContainer: {
      display: "flex",
      flexDirection: "column" as const,
      flex: 1,
      minHeight: 0
    },

    paginationContainer: {
      width: "100%",
      height: "56px",
      padding: "0 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0px 8px 32px rgba(0,0,0,0.08)",
      flexShrink: 0
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                MAIN RETURN                                 */
  /* -------------------------------------------------------------------------- */

  return (
    <>
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

      <div style={styles.schoolYearContainer}>
        <Title style={styles.schoolYearHeader}>Danh sách niên khóa</Title>
        <Button onClick={() => setIsAddModalOpen(true)} style={styles.addYearBtn}>
          Thêm niên khóa
        </Button>
      </div>

      <div style={styles.mainContentContainer}>

        <div className="tableContent" style={{ flex: 1, overflowY: "auto" }}>
          <Table
            scroll={{ x: 900 }}
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            rowKey="key"
          />
        </div>

        <div style={styles.paginationContainer}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Text style={{ color: "#94A3B8" }}>
              {start} - {end} trên tổng {total}
            </Text>

            <Text style={{ color: "#94A3B8" }}>{dataSize} dữ liệu / trang</Text>

            <Dropdown overlay={pageSizeMenu} trigger={['click']}>
              <img src="/src/assets/Down.png" style={{ height: "14px", width: "14px" }} />
            </Dropdown>
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Pagination
              current={currentPage}
              pageSize={dataSize}
              total={total}
              onChange={handlePageChange}
              showSizeChanger={false}
            />

            <Text style={{ color: "#94A3B8" }}>Đến trang</Text>

            <input
              type="number"
              value={goToPage ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setGoToPage(value === "" ? null : Number(value));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && goToPage !== null) {
                  const max = Math.ceil(total / dataSize);
                  setCurrentPage(Math.max(1, Math.min(goToPage, max)));
                }
              }}
              style={{
                fontSize: "14px",
                width: "50px",
                height: "28px",
                border: "1px solid #E1E1E1",
                borderRadius: "4px",
                paddingLeft: "8px",
                outline: "none"
              }}
            />
          </div>
        </div>
      </div>

      {/* MODALS GIỮ NGUYÊN */}
      {/* ADD */}
      <Modal
        open={isAddModalOpen}
        footer={null}
        centered
        closeIcon={null}
        width={364}
        styles={{ content: { padding: 32 } }}
      >
        <div
          style={{
            width: "300px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          <img src="/src/assets/modalpic.png" style={{ width: "100%", height: "200px" }} />
          <img
            src="/src/assets/primary.png"
            onClick={() => setIsAddModalOpen(false)}
            style={{ position: "absolute", width: "40px", height: "40px", top: 25, right: 25 }}
          />

          <Title style={{ marginTop: "18px", fontWeight: 500, fontSize: "20px", color: "#334155" }}>
            Tạo niên khóa
          </Title>

          <Text style={{ textAlign: "center", marginTop: "12px", color: "#334155" }}>
            Chọn năm bắt đầu và kết thúc của <br /> của niên khóa
          </Text>

          <RangePicker
            picker="year"
            placeholder={['Từ năm', 'Đến năm']}
            suffixIcon={null}
            prefix={<CalendarOutlined style={{ width: 14, height: 14, color: "#94A3B8", marginRight: 5 }} />}
            style={{ width: "100%", marginTop: 26, fontSize: 16, height: 40 }}
          />

          <Button
            style={{
              backgroundColor: "#F2F9FF",
              margin: "32px 0 12px",
              width: "100%",
              color: "#008AFF",
              borderRadius: "8px",
              height: "40px",
              fontSize: "16px"
            }}
          >
            Tạo niên khóa
          </Button>
        </div>
      </Modal>

      {/* DELETE */}
      <Modal
        open={isDeleteModalOpen}
        footer={null}
        centered
        closeIcon={null}
        width={364}
        styles={{ content: { padding: 32 } }}
      >
        <div
          style={{
            width: "300px",
            position: "relative",
            display: "flex",
            alignItems: "center",
            flexDirection: "column"
          }}
        >
          <img src="/src/assets/Illustration.png" style={{ width: "100%", height: "223px" }} />
          <img
            src="/src/assets/primary.png"
            onClick={() => setIsDeleteModalOpen(false)}
            style={{ position: "absolute", width: "40px", height: "40px", top: 25, right: 25 }}
          />

          <Title style={{ marginTop: 18, fontWeight: 500, fontSize: 20, color: "#334155" }}>
            Xác nhận xóa niên khóa
          </Title>

          <Text style={{ marginTop: 12, fontSize: 16, color: "#334155" }}>
            Niên khóa sẽ bị xóa và không thể khôi phục
          </Text>

          <Button
            style={{
              marginTop: 24,
              marginBottom: 12,
              height: 40,
              width: "100%",
              fontSize: 16,
              borderRadius: 8,
              backgroundColor: "#FFFBFB",
              color: "#f52933"
            }}
          >
            Xóa niên khóa
          </Button>
        </div>
      </Modal>
    </div>

      <style>
     {`
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          input[type="number"] {
            -moz-appearance: textfield;
          }

          .ant-pagination-item a {
            color: #64748B !important
          }

          .ant-pagination-item-active a {
            color: #008AFF !important;
          }

          .ant-pagination-item-active {
            background-color: #f2f9ff !important;
            border: none !important
          }

          .tableContent::-webkit-scrollbar {
            display: none
          }

          .ant-table-thead > tr > th::before {
            display: none !important
          }

          body::-webkit-scrollbar {
            display: none;
          }
     `}
      </style>
    </>
  );
}

export default SchoolYearManagement;



