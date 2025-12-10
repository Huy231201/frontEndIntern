
import React, { useEffect, useState } from "react";
import { Button, Typography, Table, Modal, DatePicker, Pagination, Dropdown, Menu } from 'antd';
import { useOutletContext } from "react-router-dom";
import { CalendarOutlined } from "@ant-design/icons";
import { useSchoolYear } from "../context/SchoolYearContext"
import type { SchoolYear } from "../context/SchoolYearContext";
import { useClass } from "../context/ClassContext";
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

type ContextType = { setPageTitle: (title: string) => void };

// interface SchoolYear {
//   id: number;
//   year: string;
// }


function SchoolYearManagement() {

  const { setPageTitle } = useOutletContext<ContextType>();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [startYear, setStartYear] = useState<any>(null);
  const [endYear, setEndYear] = useState<any>(null);
  const [deleteYear, setDeleteYear] = useState<number | null>(null)


  // Sử dụng Hook Context để lấy classes
  const { classes } = useClass();

  // Hàm đếm số lớp theo niên khóa
  const countClassesBySchoolYear = (yearid: number) => {
    return classes.filter(c => c.schoolYearID === yearid).length;
  }


  // Lấy dữ liệu niên khóa
  const { schoolYears, setSchoolYears } = useSchoolYear();


  const [currentPage, setCurrentPage] = useState(1);
  const [dataSizeState, setDataSizeState] = useState(10);

  const dataSize = dataSizeState;

  // Dữ liệu theo trang
  const total = schoolYears.length;
  const start = (currentPage - 1) * dataSize + 1;
  const end = Math.min(currentPage * dataSize, total);

  // Tạo state để lưu trạng thái sort niên khóa
  const [sortInfo, setSortInfo] = useState<{ columnKey: string; order: "ascend" | "descend" | null }>({
    columnKey: "",
    order: null
  })


  // Sort niên khóa và số lượng 
  const sortedYears = [...schoolYears].sort((a, b) => {
    // Nếu không có order thì không sort
    if (!sortInfo.order) return 0;

    // --- SORT THEO NIÊN KHÓA ---
    if (sortInfo.columnKey === "year") {
      const startA = Number(a.year.split(" - ")[0]);
      const startB = Number(b.year.split(" - ")[0]);

      if (startA !== startB) {
        return sortInfo.order === "ascend" ? startA - startB : startB - startA;
      }

      const endA = Number(a.year.split(" - ")[1]);
      const endB = Number(b.year.split(" - ")[1]);

      return sortInfo.order === "ascend" ? endA - endB : endB - endA;
    }

    // --- SORT THEO SỐ LƯỢNG LỚP ---
    if (sortInfo.columnKey === "classCount") {
      const countA = countClassesBySchoolYear(a.id);
      const countB = countClassesBySchoolYear(b.id);

      return sortInfo.order === "ascend"
        ? countA - countB
        : countB - countA;
    }

    return 0;
  });


  const currentData = sortedYears.slice(start - 1, end);

  const [goToPage, setGoToPage] = useState<number | null>(null);

  // Tạo danh sách lựa chọn PageSize
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
  )

  useEffect(() => {
    setPageTitle("Quản lý niên khóa");
  }, [setPageTitle]);


  // Hàm xử lý thêm niên khóa
  const handleAddYear = () => {
    if (!startYear || !endYear) return;

    const nextId = schoolYears.length > 0 ? Math.max(...schoolYears.map(y => y.id)) + 1 : 1;


    const newYear: SchoolYear = {
      id: nextId,
      year: `${startYear.year()} - ${endYear.year()}`,
    };

    setSchoolYears(prev => [...prev, newYear]);

    setStartYear(null);
    setEndYear(null);
    setIsAddModalOpen(false);
  }


  // Hàm xử lý xóa niên khóa
  const handleDeleteYear = () => {
    if (deleteYear === null) return;
    setSchoolYears(prev => prev.filter(year => year.id !== deleteYear))
    setDeleteYear(null);
    setIsDeleteModalOpen(false);
  }

  // Hàm xử lý chuyển trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Tùy chọn: Đặt lại goToPage sau khi chuyển trang
    // setGoToPage(null); 
  }


  // Hàm xử lý thay đổi số lượng dữ liệu/ trang
  const handleDataSizeChange = (value: number) => {
    setDataSizeState(value);
    setCurrentPage(1);
  }

  const columns = [
    {
      title: (
        <span style={{ fontSize: "14px", fontWeight: 600 }}>Hành động</span>
      ),
      key: "action",
      width: "33.33%",

      render: (_: any, record: SchoolYear) => (
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Button
            onClick={() => {
              setDeleteYear(record.id);
              setIsDeleteModalOpen(true)
            }}
            style={{outline: "none", width: "40px", height: "32px", borderRadius: "8px", padding: 0 }}>
            <img
              src="/src/assets/delete.png"
              alt="Xóa"
              style={{width: "40px", height: "32px", objectFit: "cover", borderRadius: "8px" }}
            />
          </Button>

          <Button style={{outline: "none", width: "40px", height: "32px", borderRadius: "8px", padding: 0 }}>
            <img
              src="/src/assets/edit.png"
              alt="Sửa"
              style={{ width: "40px", height: "32px", objectFit: "cover", borderRadius: "8px" }}
            />
          </Button>
        </div>
      ),
    },

    {
      title: (
        <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
          <span style={{ fontSize: "14px", fontWeight: 600 }}>Niên khóa</span>
          <img src="/src/assets/active.png"
            style={{
              height: "14px",
              width: "14px"
            }}
            onClick={() => {
              setSortInfo(prev => ({
                columnKey: "year",
                order:
                  prev.columnKey === "year"
                    ? prev.order === "ascend"
                      ? "descend"
                      : prev.order === "descend"
                        ? null
                        : "ascend"
                    : "ascend"
              }))
            }}
          />
        </div>
      ),
      width: "33.33%",
      dataIndex: "year",
      key: "year",
      render: (text: string) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Text
            style={{
              fontWeight: 400,
              fontSize: "14px",
              color: "#008AFF"

            }}
          >
            {text}
          </Text>
        </div>
      )
    },

    {
      title: (
        <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
          <span style={{ fontSize: "14px", fontWeight: 600 }}>Số lượng lớp thuộc niên khóa</span>
          <img src="/src/assets/active.png"
            style={{
              height: "14px",
              width: "14px"
            }}
            onClick={() => {
              setSortInfo(prev => ({
                columnKey: "classCount",
                order:
                  prev.columnKey === "classCount"
                    ? prev.order === "ascend"
                      ? "descend"
                      : prev.order === "descend"
                        ? null
                        : "ascend"
                    : "ascend"
              }));
            }}
          />

        </div>
      ),
      width: "33.33%",
      key: "classCount",
      render: (_: any, record: SchoolYear) => (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Text
            style={{
              fontWeight: 400,
              fontSize: "14px"
            }}
          >{countClassesBySchoolYear(record.id)} lớp</Text>
        </div>
      )
    },
  ];


  const styles = {
    // Header
    schoolYearContainer: {
      width: "100%",
      height: "60px",
      padding: "10px 24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid #E2E8F0",
      flexShrink: 0 // Ngăn header bị co lại
    },

    schoolYearHeader: {
      fontWeight: 600,
      fontSize: "18px",
      display: "inline-block"
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

    // Main Content Container: Bọc Table và Pagination
    mainContentContainer: {
      display: "flex",
      flexDirection: "column" as const,
      flex: 1, // Quan trọng: Đảm bảo container này giãn ra hết chiều cao còn lại
      minHeight: 0
    },
    // Pagination Bar
    paginationContainer: {
      width: "100%",
      height: "56px",
      padding: "0 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0px 8px 32px 0px rgba(0, 0, 0, 0.08)",
      // borderTop: "1px solid #E2E8F0",
      flexShrink: 0 // Ngăn pagination bị co lại
    }
  }

  return (
    // Đặt container ngoài cùng là Flexbox để chiếm hết chiều cao parent
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={styles.schoolYearContainer}>
        <Title style={styles.schoolYearHeader}>Danh sách niên khóa</Title>
        <Button onClick={() => setIsAddModalOpen(true)} style={styles.addYearBtn}>Thêm niên khóa</Button>
      </div>


      {/* Main Content: Bảng + Pagination */}
      <div style={styles.mainContentContainer}>
        {/* Div chứa Table: flex: 1 để giãn ra đẩy pagination xuống */}
        <div className="tableContent" style={{ flex: 1, overflowY: "auto" as const }}>
          <Table
            scroll={{ x: 900 }}
            dataSource={currentData}
            columns={columns}
            rowKey="id"
            pagination={false}
            components={{
              header: {
                cell: (props) => (
                  <th {...props} style={{ height: "48px", padding: "0 16px" }} />
                )
              },
              body: {
                cell: (props) => (
                  <td {...props} style={{ padding: "0 16px", height: "48px" }} />
                )
              }
            }}
          />
        </div>


        {/* Div bọc pagination */}
        <div style={styles.paginationContainer}>

          {/* Bên trái pagination */}
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <Text style={{ color: "#94A3B8", fontSize: "14px", fontWeight: 400 }}>
              {start} - {end} trên tổng {total}
            </Text>
            <Text style={{ color: "#94A3B8", fontSize: "14px", fontWeight: 400 }}>
              {dataSize} dữ liệu / trang
            </Text>
            <Dropdown overlay={pageSizeMenu} trigger={['click']}>
              <img
                src="/src/assets/Down.png"
                style={{
                  height: "14px",
                  width: "14px"
                }}
              />
            </Dropdown>

          </div>

          {/* Bên phải pagination */}
          <div style={{
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}>
            <Pagination
              current={currentPage}
              pageSize={dataSize}
              total={total}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper={false}
            />

            <Text style={{ color: "#94A3B8", fontSize: "14px", fontWeight: 400 }} >Đến trang</Text>

            <input
              type="number"
              value={goToPage ?? ""}
              onChange={(e) => {
                const value = e.target.value;
                setGoToPage(value === "" ? null : Number(value));
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && goToPage !== null) {
                  const maxPage = Math.ceil(total / dataSize);
                  const page = Math.max(1, Math.min(goToPage, maxPage));
                  setCurrentPage(page);
                }
              }}
              style={{
                fontSize: "14px",
                width: "50px",
                height: "28px",
                border: "1px solid #E1E1E1",
                borderRadius: "4px",
                paddingLeft: "8px",
                outline: "none",
              }}
            />

          </div>


        </div>

      </div>


      {/*Modal quản lý thêm niên khóa*/}
      <Modal
        open={isAddModalOpen}
        footer={null}
        centered
        closeIcon={null}
        width={364}

        styles={{
          content: {
            padding: 32
          }
        }}
      >
        <div style={{
          width: "300px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          flexDirection: "column" as const
        }}>
          <img src="/src/assets/modalpic.png"
            style={{
              width: "100%",
              height: "200px"
            }}
          />
          <img src="/src/assets/primary.png"
            onClick={() => setIsAddModalOpen(false)}
            style={{ position: "absolute", width: "40px", height: "40px", top: 25, right: 25 }}
          />

          <Title
            style={{
              marginTop: "18px",
              fontWeight: 500,
              fontSize: "20px",
              color: "#334155"
            }}
          >
            Tạo niên khóa
          </Title>

          <Text
            style={{
              textAlign: "center",
              marginTop: "12px",
              color: "#334155"
            }}
          >
            Chọn năm bắt đầu và kết thúc của <br /> của niên khóa
          </Text>

          <RangePicker
            picker="year"
            placeholder={['Từ năm', 'Đến năm']}
            suffixIcon={null}
            prefix={
              <CalendarOutlined style={{ width: "13.33px", height: "13.33px", color: "#94A3B8", marginRight: "5.33px" }} />
            }
            onChange={(values) => {
              setStartYear(values?.[0] || null);
              setEndYear(values?.[1] || null);
            }}

            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddYear();
              }
            }}

            style={{
              width: "100%",
              marginTop: "26px",
              fontWeight: 400,
              fontSize: "16px",
              height: "40px"
            }}
          />
          <Button
            onClick={handleAddYear}
            style={{
              backgroundColor: "#F2F9FF",
              margin: "32px 0 12px",
              width: "100%",
              color: "#008AFF",
              borderRadius: "8px",
              height: "40px",
              fontWeight: 500,
              fontSize: "16px"
            }}
          >
            Tạo niên khóa
          </Button>
        </div>
      </Modal>


      {/*Modal quản lý xóa niên khóa*/}
      <Modal
        open={isDeleteModalOpen}
        footer={null}
        centered
        closeIcon={null}
        width={364}

        styles={{
          content: {
            padding: 32
          }
        }}
      >
        <div style={{
          width: "300px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          flexDirection: "column" as const
        }}
        >
          <img src="/src/assets/Illustration.png"
            style={{
              width: "100%",
              height: "223.54px"
            }}
          />
          <img src="/src/assets/primary.png"
            onClick={() => setIsDeleteModalOpen(false)}
            style={{ position: "absolute", width: "40px", height: "40px", top: 25, right: 25 }}
          />

          <Title
            style={{
              marginTop: "18px",
              fontWeight: 500,
              fontSize: "20px",
              color: "#334155"
            }}
          >
            Xác nhận xóa niên khóa
          </Title>

          <Text
            style={{
              marginTop: "12px",
              fontWeight: 400,
              fontSize: "16px",
              color: "#334155"
            }}
          >
            Niên khóa sẽ bị xóa và không thể khôi phục
          </Text>

          <Button
            onClick={handleDeleteYear}
            style={{
              marginTop: "24px",
              marginBottom: "12px",
              height: "40px",
              width: "100%",
              fontWeight: 500,
              fontSize: "16px",
              borderRadius: "8px",
              backgroundColor: "#FFFBFB",
              color: "#f52933"
            }}
          >Xóa niên khóa</Button>

        </div>

      </Modal>


      <style>
        {`
          /* Chrome, Safari, Edge */
          input[type="number"]::-webkit-inner-spin-button,
          input[type="number"]::-webkit-outer-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }

          /* Firefox */
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
    </div>


  );
}

export default SchoolYearManagement;


