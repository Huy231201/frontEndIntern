import React, { useEffect, useState } from "react";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { Typography, Button, Input, Radio, Table, Modal, Select, Checkbox, Dropdown, Pagination, Menu } from "antd";
import { useGrade } from "../context/GradeContext";
import { useSchoolYear } from "../context/SchoolYearContext";
import { useClass } from "../context/ClassContext";
import { useStudent } from "../context/StudentContext";
import type { Student } from "../context/StudentContext"
import {getStudentApi, createStudentApi, deleteOneStudentApi, deleteMultipleStudentsApi, updateStudentApi} from "../api/studentApi"


const { Title, Text } = Typography;


type ContextType = { setPageTitle: (title: string) => void };

function StudentManagement() {

    /*
    1. CONTEXT/PROVIDER
    */
    const { setPageTitle } = useOutletContext<ContextType>()
    const { grade } = useGrade();
    const { classes } = useClass();
    const { schoolYear } = useSchoolYear();
    const { students, setStudents } = useStudent();

    const [searchParams] = useSearchParams();
    const classIDFromURL = searchParams.get("classID");

    /* 
    2.  PAGE TITLE
    */
    useEffect(() => {
        setPageTitle("Quản lý học sinh");
    }, [setPageTitle]);

    /*
    3. READ CLASS FROM URL
    */

    // useEffect(() => {
    //     if (!classIDFromURL) return;

    //     const id = Number(classIDFromURL);
    //     const cls = classes.find(c => c.id === id);
    //     if (!cls) return;

    //     // set đúng bộ lọc theo lớp được click
    //     setActiveYear(cls.schoolYear);
    //     setActiveGrade(cls.gradeId);
    //     setSelectedClass(cls.id);
    // }, [classIDFromURL, classes]);


    /*
    4. STATE- FILTER AND SELECTION
    */
    const [activeGrade, setActiveGrade] = useState<string | null>(null);
    const [activeYear, setActiveYear] = useState<string | null>(null);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [currentStudent, setCurrentStudent] = useState<Student | null>(null);

      /*
    5. STATE- MODAL 
    */
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    

    /*
    6. STATE - ADD STUDENT + UPDATE STUDENT FORM
    */
    // State để thêm lưu các dữ liệu học sinh mới
    const [newStudentName, setNewStudentName] = useState("");
    const [newStudentSchoolYear, setNewStudentSchoolYear] = useState<string | null>(null);
    const [activeGradeInModal, setActiveGradeInModal] = useState<string | null>(null);
    const [newStudentClass, setNewStudentClass] = useState<string | null>(null);
    const [newStudentDiscounts, setNewStudentDiscounts] = useState<string[]>([]);
    const [newParentName, setNewParentName] = useState("");
    const [newParentPhone, setNewParentPhone] = useState("");
    const [newParentEmail, setNewParentEmail] = useState("");

     // State để chỉnh sửa thông tin học sinh
    const [editSchool, setEditSchool] = useState<string>("");
    const [editStudentCode, setEditStudentCode] = useState<string>("");
    const [editSchoolYearName, setEditSchoolYearName] = useState<string>("");
    const [editGradeName, setEditGradeName] = useState<string>("");
    const [editStudentName, setEditStudentName] = useState<string>("");
    const [editClassID, setEditClassID] = useState<string>("");
    const [editClassName, setEditClassName] = useState<string>("");
    const [editParentName, setEditParentName] = useState<string>("");
    const [editParentPhone, setEditParentPhone] = useState<string>("");
    const [editParentEmail, setEditParentEmail] = useState<string>("");
    const [editDiscounts, setEditDiscounts] = useState<string[]>([]);


    // hàm thêm học sinh
    const handleAddStudent = async () => {
        if(!newStudentName.trim() || !newStudentSchoolYear?.trim() || !activeGradeInModal?.trim() || !newStudentClass?.trim()) return;
        try {
            const generatedCode = `CLIENT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
            const dateOfBirth = new Date().toISOString().split("T")[0];
            await createStudentApi(
                generatedCode, newStudentName, newParentName, newParentPhone, dateOfBirth, newStudentDiscounts, newStudentClass
            );

            const listResponse = await getStudentApi();

            const sortedListResponse = [...listResponse.data].sort(
                (a,b) => 
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
            );

            setStudents(sortedListResponse);


            // Reset form
            setNewStudentName("");
            setActiveGradeInModal("");
            setNewStudentSchoolYear(null);
            setNewStudentClass(null);
            setNewParentName("");
            setNewParentPhone("");
            setNewStudentDiscounts([]);

            setIsAddModalOpen(false);
        }
        catch (err) {
            console.log("Lỗi tạo học sinh",err)
        }
    }

    // Hàm xóa học sinh
    const handleDeleteStudents = async () => {
        if (selectedRowKeys.length === 0) return;

        const ids = selectedRowKeys.map(String);

        try {
            if (ids.length === 1) {
                await deleteOneStudentApi(ids[0]);
            } else {
                await deleteMultipleStudentsApi(ids);
            }

            setStudents(prev => prev.filter(s => !ids.includes(s.id)))
            setSelectedRowKeys([])
        }
        catch (err) {
            console.log("Lỗi xóa học sinh", err)
        }
    } 

    // hàm chỉnh sửa học sinh
    const handleUpdateStudent = async () => {
        if (!currentStudent) return;

        try {
            const response = await updateStudentApi(
                currentStudent.id,
                editStudentCode || currentStudent.code,
                editStudentName || currentStudent.name,
                editParentName || currentStudent.parentName,
                editParentPhone || currentStudent.parentPhoneNumber,
                currentStudent.dateOfBirth,
                editDiscounts?.length? editDiscounts : currentStudent.feeReductionTypes,
                editClassID || currentStudent.class.id
            );
        
        setStudents(prev =>
            prev.map(s =>
                s.id === currentStudent.id? response.data: s
            )
        )
        
        setIsUpdateModalOpen(false);

        } catch(err) {
            console.log("Lỗi cập nhật học sinh", err);
        }
    }

    // Đồng bộ currentStudent với dữ liệu mới nhất trong students mỗi khi danh sách sinh viên thay đổi
    //để sinh viên đang được chọn luôn hiển thị thông tin cập nhật.
    useEffect(() => {
    if (!currentStudent) return;

    const updated = students.find(s => s.id === currentStudent.id);
    if (updated) {
        setCurrentStudent(updated);
    }
    }, [students]);


    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys: React.Key[]) => {
            setSelectedRowKeys(selectedKeys);
        },
    };

    const discountOptions = [
        { label: "Con thương binh", value: "Con thương binh", amount: "- 20%" },
        { label: "Vùng sâu vùng xa", value: "Vùng sâu vùng xa", amount: "- 50,000đ" },
        { label: "Miễn học phí", value: "Miễn học phí", amount: "- 100%" },
        { label: "Giảm học phí", value: "Giảm học phí", amount: "- 20%" },
    ];


    /*
    DATA FILTERING
    */
    // Lọc lớp theo khối + niên khóa
    const filteredClasses = classes.filter(cls => {
        const matchGrade = activeGrade ? cls.gradeId === activeGrade : true;
        const matchYear = activeYear ? cls.schoolYear === activeYear : true;
        return matchGrade && matchYear;
    }
    )

    // Lọc lớp theo khối + niên khóa trong modal
    const filteredClassesForAddModal = classes.filter(cls => {
        const matchGrade = activeGradeInModal ? cls.gradeId === activeGradeInModal : false;
        const matchYear = newStudentSchoolYear ? cls.schoolYear === newStudentSchoolYear : false;
        return matchGrade && matchYear;
    });

    // Lọc học sinh theo lớp
    const filteredStudents = selectedClass ? students.filter(s => s.class.id === selectedClass) : [];



    /*
    EFFECT - RESET FILTER LOGIC
    */
    useEffect(() => {
        if (classIDFromURL) return;
        setSelectedClass(null);
    }, [activeGrade, activeYear])

    // Reset khối khi chọn niên khóa
    useEffect(() => {
        if (classIDFromURL) return;
        setActiveGrade(null);
    }, [activeYear]);



    // Hàm cập nhật thông tin học sinh
    // const handleUpdateStudent = () => {
    //     if (!currentStudent) return;

    //     // tìm id tương ứng từ tên
    //     const foundGrade = grade.find(g => g.name?.trim().toLowerCase() === editGradeName.trim().toLowerCase());
    //     const foundSchoolYear = schoolYears.find(sy => sy.year?.trim().toLowerCase() === editSchoolYearName.trim().toLowerCase());

    //     if (!foundGrade) {
    //         return;
    //     }

    //     if (!foundSchoolYear) {
    //         return;
    //     }

    //     setStudents(prev => {
    //         const updatedStudents = prev.map(stu =>
    //             stu.id === currentStudent.id
    //                 ? {
    //                     ...stu,
    //                     fullName: editStudentName || stu.fullName,
    //                     studentCode: editStudentCode || stu.studentCode,
    //                     school: editSchool || stu.school,
    //                     schoolYearID: foundSchoolYear.id,
    //                     gradeID: foundGrade.id,
    //                     classID: editClass ?? stu.classID,
    //                     discounts: editDiscounts ?? [],
    //                     parent: {
    //                         fullName: editParentName ?? "",
    //                         phone: editParentPhone ?? "",
    //                         email: editParentEmail ?? ""
    //                     }
    //                 }
    //                 : stu
    //         );

    //         // Cập nhật luôn currentStudent để modal hiển thị liền
    //         const updatedCurrent = updatedStudents.find(stu => stu.id === currentStudent.id) ?? null;
    //         setCurrentStudent(updatedCurrent);

    //         return updatedStudents;
    //     });

    //     setIsUpdateModalOpen(false);
    // };



    // 1. Luôn default array
    const safeClasses = classes ?? [];
    const safeGrades = grade ?? [];
    const safeSchoolYears = schoolYear ?? [];

    // 2. Chuyển editGradeName / editSchoolYearName thành string an toàn
    const safeEditGradeName = editGradeName ?? "";
    const safeEditSchoolYearName = editSchoolYearName ?? "";

    // 3. Lọc lớp cho modal edit
    // const filteredClassesForEditModal = safeClasses.filter(cls => {
    //     const gradeObj = safeGrades.find(
    //         g => (g.name ?? "").trim().toLowerCase() === safeEditGradeName.trim().toLowerCase()
    //     );
    //     const yearObj = safeSchoolYears.find(
    //         sy => (sy.year ?? "").trim().toLowerCase() === safeEditSchoolYearName.trim().toLowerCase()
    //     );

    //     const matchGrade = gradeObj ? cls.gradeID === gradeObj.id : false;
    //     const matchYear = yearObj ? cls.schoolYearID === yearObj.id : false;

    //     return matchGrade && matchYear;
    // });















    /*
    TABLE CONFIG
    */
   
    // Hàm chỉnh màu cho từng loại discount 
    const getDiscountColor = (type: string) => {
        switch (type) {
            case "Vùng sâu vùng xa":
                return "#FF8156"
            case "Con thương binh":
                return "#9667EF"
            case "Miễn học phí":
                return "#3A70E2"
        }
    }


    // Nội dung từng cột table
    const columns = [

        {
            title: (
                <span style={{ fontWeight: 500, fontSize: "14px", color: "#475569" }}>STT</span>
            ),
            key: "order",
            width: "8%",
            render: (_: any, __: any, index: number) => { 
                const order = (currentPage - 1) * dataSize + index + 1;
                return (
                <span style={{ fontWeight: 400, fontSize: "14px", color: "#475569" }}>{order.toString().padStart(2, "0")}</span>
            )
        }
        },

        {
            title: (
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ fontWeight: 500, fontSize: "14px", color: "#475569" }}>Họ và tên</span>
                    <img style={{ width: "14px", height: "14px" }} src="src/assets/active.png" />
                </div>
            ),
            key: "fullName",
            width: "22%",
            render: (_: any, record: Student) => (
                <span style={{ fontWeight: 400, cursor: "pointer", fontSize: "14px" }}
                    onClick={() => {
                        setCurrentStudent(record);
                        setIsViewModalOpen(true);
                    }}
                >
                    {record.name}
                </span>
            )
        },

        {
            title: (
                <span style={{ fontWeight: 500, fontSize: "14px", color: "#475569" }} > Loại miễn giảm </span>
            ),
            key: "discounts",
            width: "63%",
            render: (_: any, record: Student) => (
                <div style={{ display: "flex", gap: "14px" }}>
                    {record.feeReductionTypes.length === 0 ? (
                        <span
                            style={{
                                padding: "1px 6px",
                                borderRadius: "8px",
                                color: "#FFF",
                                fontSize: "12px",
                                fontWeight: 400,
                                backgroundColor: "#94A3B8",
                                textAlign: "center"
                            }}
                        >
                            Không có
                        </span>
                    ) : (
                        record.feeReductionTypes.map((discount, index) => (
                            <span
                                key={index}
                                style={{
                                    padding: "1px 6px",
                                    borderRadius: "8px",
                                    color: "#FFF",
                                    fontSize: "12px",
                                    fontWeight: 400,
                                    backgroundColor: getDiscountColor(discount),
                                    textAlign: "center"
                                }}
                            >
                                {discount}
                            </span>
                        ))
                    )
                    }
                </div>
            )
        }
    ]

    /*
    STATE - PAGINATION
    */
    const [currentPage, setCurrentPage] = useState(1);
    const [dataSize, setDataSize] = useState(3);
    const [goToPage, setGoToPage] = useState<number | null>(null);

    // Tính toán các giá trị phân trang
    // const total = students.length;
    const dataSource = filteredStudents;
    const total = dataSource.length;

    const start = total === 0 ? 0 : (currentPage - 1) * dataSize + 1;
    const end = Math.min(currentPage * dataSize, total);

    // Tách dữ liệu hiển thị theo trang
    const paginatedStudents = dataSource.slice(
        (currentPage - 1) * dataSize,
        currentPage * dataSize
    )


    // Hàm chuyển trang
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    }

    // Menu thay đổi số dòng /trang
    const pageSizeMenu = (
        <Menu
            onClick={(info) => {
                const size = Number(info.key);
                setDataSize(size);
                setCurrentPage(1); // về trang 1 khi thay đổi kích thước trang
            }}
            items={[
                { key: "3", label: "3 dữ liệu / trang" },
                { key: "20", label: "20 dữ liệu / trang" },
                { key: "50", label: "50 dữ liệu / trang" },
            ]}
        />
    );


    /*
    EFFECT - PAGINATION AND SELECTION SYNC
    */

    // Reset selectedRowKeys nếu học sinh đã bị xóa hoặc thay trang
    useEffect(() => {
        // loại bỏ các selected key không còn tồn tại trong filteredStudents
        const validKeys = selectedRowKeys.filter(k => students.some(s => s.id === k));
        if (validKeys.length !== selectedRowKeys.length) {
            setSelectedRowKeys(validKeys);
        }
    }, [students]); // chạy khi filteredStudents thay đổi (thay lớp/khối/niên khóa)


    useEffect(() => {
        const maxPage = Math.max(1, Math.ceil(total / dataSize));
        if (currentPage > maxPage) setCurrentPage(maxPage);
    }, [total, dataSize]);

    const styles = {
        studentHeaderContainer: {
            padding: "10px 24px 0px 24px",
            height: "50px"
        },

        studentHeaderContent: {
            height: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
        },

        inputContainer: {
            display: "flex",
            alignItems: "center",
            padding: "12px 24px",
        },

        contentContainer: {
            flex: "1",
            // minHeight: 0,
            // overflow: "auto" as const,
            display: "flex",
            padding: "0px 24px",
            gap: "24px",
            overflow: "hidden"
        },

        leftSectionContainer: {
            height: "100%",
            display: "flex",
            gap: "18px",
            flexDirection: "column" as const,
            // maxHeight: "calc(100vh - 148px)",
            overflowY: "auto" as const,

        },

        gradeAndClassContainer: {
            display: "flex",
            flexDirection: "column" as const,
            gap: "18px"
        },

        gradeContainer: {
            display: "flex",
            flexDirection: "column" as const,
            gap: "12px",

        },

        rightSectionContainer: {
            width: "100%",
            display: "flex",
            flex: "1",
            flexDirection: "column" as const,
        },

        paginationContainer: {
            width: "100%",
            height: "56px",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            boxShadow: "0px 4px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 1px 0px rgba(0,0,0,0.02)",
            flexShrink: 0
        }
    }



    return (
        <>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                <div style={styles.studentHeaderContainer}>
                    <div style={styles.studentHeaderContent}>
                        <Title style={{ margin: 0, fontWeight: 600, fontSize: "18px" }}>Danh sách học sinh</Title>
                        <Button onClick={() => setIsAddModalOpen(true)} style={{ height: "100%", borderRadius: "8px", border: "1px solid #008AFF", padding: "8px", color: "#008AFF", fontWeight: 500, fontSize: "16px", boxShadow: "none", outline: "none" }}>Thêm học sinh</Button>
                    </div>
                </div>

                <div style={styles.inputContainer}>
                    <Input
                        style={{ height: "40px", borderRadius: "8px", fontWeight: 400, fontSize: "16px", padding: "0px 11px" }}
                        placeholder="Tìm theo mã học sinh hoặc tên học sinh, số điện thoại"
                        suffix={
                            <img src="/src/assets/search.png" />
                        }
                    />
                </div>


                <div style={styles.contentContainer}>
                    <div className="leftSectionContent" style={styles.leftSectionContainer}>

                        <div style={styles.gradeAndClassContainer}>

                            {/*Container bọc tiêu đề và các khối */}
                            <div style={styles.gradeContainer}>
                                <Title style={{ margin: 0, padding: "9px 12px", color: "#94A3B8", fontWeight: 400, fontSize: "12px" }}>Khối và lớp</Title>

                                {/* Hiển thị các khối */}
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(2,1fr)",
                                        gap: "12px",
                                    }}
                                >
                                    {grade.map((g) => (
                                        <Button
                                            key={g.id}
                                            onClick={() => setActiveGrade(activeGrade === g.id ? null : g.id)}
                                            style={{
                                                padding: "8px 12px",
                                                fontWeight: 400,
                                                fontSize: "16px",
                                                borderRadius: "4px",
                                                height: "40px",
                                                boxShadow: "none",
                                                outline: "none",
                                                position: "relative",
                                                color: activeGrade === g.id ? "#008AFF" : "#334155",
                                                border: activeGrade === g.id ? "1px solid #008AFF" : "1px solid #E2E8F0"
                                            }}
                                            className="grade-button"
                                        >
                                            {g.name}

                                            {activeGrade === g.id && (
                                                <img src="/src/assets/Subtract.png"
                                                    style={{
                                                        position: "absolute",
                                                        height: "20px",
                                                        width: "20px",
                                                        right: 0,
                                                        bottom: 0
                                                    }}
                                                />
                                            )
                                            }
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            {/* Hiển thị các lớp và radio chọn lớp */}
                            <Radio.Group
                                value={selectedClass}
                                onChange={(e) => setSelectedClass(e.target.value)}
                                style={{
                                    width: "180px",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "11px",
                                }}
                            >
                                {filteredClasses.map((cls) => (

                                    <div
                                        key={cls.id}
                                    >
                                        <Radio
                                            value={cls.id}
                                        >
                                            <Text style={{ margin: 0, fontWeight: 600, fontSize: "14px", color: "#64748b" }}>Lớp {cls.name}</Text>
                                            <Text style={{ marginLeft: "5px", fontWeight: 500, fontSize: "14px", color: "#94A3B8" }}>
                                                (
                                                {
                                                    cls.schoolYear
                                                }
                                                )
                                            </Text>
                                        </Radio>
                                    </div>
                                ))}
                            </Radio.Group>
                        </div>

                        {/*Container bọc hiển thị niên khóa */}
                        <div
                            style={{

                            }}
                        >
                            <Text style={{ margin: 0, padding: "9px 12px", fontWeight: 400, fontSize: "12px", color: "#94A3B8" }}>Niên khóa</Text>

                            {/* Hiển thị niên khóa và sắp xếp theo thứ tự giảm dần */}
                            {
                                // .sort((a, b) => {
                                //     const startA = Number(a.split(" - ")[0]);
                                //     const startB = Number(b.year.split(" - ")[0]);
                                //     return startB - startA
                                // })
                                schoolYear.map((year) => (
                                    <div
                                        key={year}
                                        onClick={() => setActiveYear(activeYear === year? null : year)}
                                        style={{
                                            cursor: "pointer",
                                            height: "36px",
                                            padding: "2px 4px"
                                        }}
                                    >
                                        <div style={{
                                            display: "flex",
                                            padding: "5px 20px",
                                            alignItems: "center",
                                            width: "100%",
                                            height: "100%",
                                            borderRadius: "8px",
                                            backgroundColor: activeYear === year ? "#f2f9ff" : "#FFFFFF",
                                        }}>
                                            <Text
                                                style={{
                                                    fontWeight: 400,
                                                    fontSize: "14px",
                                                    color: activeYear === year ? "#008AFF" : "#334155"
                                                }}
                                            >
                                                {year.replaceAll(' ', '')}
                                            </Text>
                                        </div>
                                    </div>
                                )
                                )}
                        </div>
                    </div>

                    {/* Thanh bar nằm giữa */}
                    <div style={{ border: "1px solid #E2E8F0", width: "0px" }}></div>

                    {/* Bảng hiển thị danh sách học sinh */}
                    <div style={styles.rightSectionContainer}>

                        {/* Thao tác xóa học sinh */}
                        {
                            selectedRowKeys.length > 0 && (
                                <div
                                    style={{
                                        display: "flex",
                                        gap: "10px",
                                        height: "40px",
                                        marginBottom: "10px",
                                        alignItems: "center"
                                    }}>
                                    <Text style={{ fontWeight: 400, fontSize: "14px" }}>Thao tác với {selectedRowKeys.length} học sinh</Text>
                                    <Button
                                        danger
                                        disabled={selectedRowKeys.length === 0}
                                        onClick={handleDeleteStudents}
                                        style={{ width: "106px", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "#FEF2F2", borderRadius: "8px", padding: "8px", gap: "4px", outline: "none", border: "none" }}>
                                        <img style={{ width: "15px", height: "15px", objectFit: "contain" }} src="/src/assets/Delete (1).png" />
                                        <Text style={{ fontWeight: 500, fontSize: "16px", color: "#F5222D" }}>Xóa</Text>
                                    </Button>
                                </div>
                            )
                        }

                        {/* Div chứa table */}
                        <div
                            className="right-container"
                            style={{ flex: "1", overflowY: "auto" as const }}
                        >
                            <Table
                                // scroll={{x:true}}
                                rowSelection={rowSelection}
                                dataSource={paginatedStudents}
                                columns={columns}
                                rowKey="id"
                                pagination={false}
                                components={{
                                    header: {
                                        cell: (props) => (
                                            <th {...props} style={{ height: "48px" }} />
                                        )
                                    },
                                    body: {
                                        cell: (props) => (
                                            <td {...props} style={{ height: "48px" }} />
                                        )
                                    }
                                }}
                            />
                        </div>
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
                </div>
            </div>

            {/* Modal thêm học sinh */}
            <Modal
                open={isAddModalOpen}
                footer={null}
                width={400}
                closeIcon={null}
                style={{
                    top: 0, marginRight: 0
                }}
            >
                {/* Thanh tiêu đề thêm học sinh */}
                <div
                    style={{
                        display: "flex",
                        width: "100%",
                        height: "58px",
                        alignItems: "center",
                        paddingLeft: "24px"
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px"
                        }}
                    >
                        <img src="src/assets/Close.png"
                            onClick={() => setIsAddModalOpen(false)}
                            style={{
                                width: "16px",
                                height: "16px"
                            }}
                        />

                        {/* Thanh bar nằm giữa */}
                        <div
                            style={{
                                width: "0px",
                                height: "16px",
                                border: "1px solid #E2E8F0",
                            }}
                        ></div>


                        <Title style={{ margin: 0, fontWeight: 500, fontSize: "18px" }}>
                            Thêm học sinh
                        </Title>
                    </div>
                </div>


                {/* Nội dung thêm thông tin học sinh */}
                <div
                    style={{
                        width: "100%",
                        height: "902px",
                        padding: "16px 16px 0",
                        backgroundColor: "#F5F5F5",
                    }}
                >


                    <div style={{
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "#FFF",
                        borderRadius: "12px",
                        marginBottom: "18px"
                    }}>

                        <div style={{ padding: "20px 18px 0", width: "100%", display: "flex", flexDirection: "column" }}>
                            <Title style={{ margin: 0, fontWeight: 500, fontSize: "14px", marginBottom: "16px" }}>Thông tin học sinh</Title>

                            {/* Input điền tên học sinh */}
                            <Input
                                placeholder="Tên học sinh"
                                value={newStudentName}
                                onChange={(e) => setNewStudentName(e.target.value)}
                                style={{
                                    color: "#94A3B8",
                                    fontWeight: 400,
                                    fontSize: "16px",
                                    padding: "0px 12px",
                                    borderRadius: "12px",
                                    marginBottom: "16px",
                                    height: "40px"
                                }}
                            />

                            {/* Lựa chọn niên khóa */}
                            <Select
                                placeholder="Niên khóa"
                                style={{ marginBottom: "8px" }}
                                value={newStudentSchoolYear}
                                onChange={(value) => setNewStudentSchoolYear(value)}
                                options={
                                    schoolYear.map(year => ({
                                        label: year,
                                        value: year
                                    }))
                                }
                                suffixIcon={
                                    <img src="/src/assets/Down (2).png"
                                    />
                                }
                            />

                            {/* Chọn lựa khối */}
                            <div
                            style={{
                                overflow: "hidden"
                            }}
                            >
                            <div
                                style={{
                                    display: "flex",
                                    gap: "12px",
                                    overflowX: "auto" as const
                                }}
                                className="grade-select-in-modal"
                            >
                                {grade.map((g) => (
                                    <Button
                                        key={g.id}
                                        onClick={() => setActiveGradeInModal(g.id)}
                                        style={{
                                            padding: "8px 12px",
                                            fontWeight: 400,
                                            fontSize: "16px",
                                            borderRadius: "4px",
                                            height: "40px",
                                            boxShadow: "none",
                                            outline: "none",
                                            position: "relative",
                                            color: activeGradeInModal === g.id ? "#008AFF" : "#334155",
                                            border: activeGradeInModal === g.id ? "1px solid #008AFF" : "1px solid #E2E8F0"
                                        }}
                                        className="grade-button-modal"
                                    >
                                        {g.name}

                                        {activeGradeInModal === g.id && (
                                            <img src="/src/assets/Subtract.png"
                                                style={{
                                                    position: "absolute",
                                                    height: "20px",
                                                    width: "20px",
                                                    right: 0,
                                                    bottom: 0
                                                }}
                                            />
                                        )
                                        }
                                    </Button>
                                ))}
                            </div>
                            </div>

                            {/* Chọn lớp */}
                            <Select
                                placeholder="Chọn lớp"
                                value={newStudentClass}
                                onChange={(value) => setNewStudentClass(value)}
                                // disabled={!activeGradeInModal || !newStudentSchoolYear}
                                style={{ margin: "8px 0 20px" }}
                                options={
                                    filteredClassesForAddModal.map(cls => ({
                                        label: cls.name,
                                        value: cls.id
                                    }))
                                }
                                suffixIcon={
                                    <img src="/src/assets/Down (2).png"
                                    />
                                }
                            />
                        </div>
                    </div>


                    {/*Div chứa loại miễn giảm học phí */}
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            backgroundColor: "#FFF",
                            borderRadius: "12px",
                            marginBottom: "18px"
                        }}
                    >
                        <div style={{ padding: "20px 18px 0", width: "100%", display: "flex", flexDirection: "column", marginBottom: "8px" }}>
                            <Title style={{ margin: 0, fontWeight: 500, fontSize: "14px", color: "#334155" }}>Loại miễn giảm học phí</Title>
                        </div>

                        {/* List loại miễn giảm */}
                        <div style={{ padding: "8px 18px", width: "100%", marginBottom: "12px" }}>

                            <Checkbox.Group
                                value={newStudentDiscounts}
                                onChange={(list) => setNewStudentDiscounts(list)}
                                style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}
                            >
                                {discountOptions.map((item) => (
                                    <div
                                        key={item.value}
                                        style={{ width: "100%", display: "flex", gap: "24px", alignItems: "center" }}
                                    >
                                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                            <Checkbox value={item.value} />
                                            <Text style={{ fontWeight: 600, fontSize: "14px" }}>{item.label}</Text>
                                        </div>

                                        <div style={{ flex: 1, border: "1px solid #E2E8F0", borderStyle: "dashed" }} />

                                        <Text style={{ fontSize: "14px", fontWeight: 600, color: "#0C9D61" }}>
                                            {item.amount}
                                        </Text>
                                    </div>
                                ))}
                            </Checkbox.Group>
                        </div>
                    </div>

                    {/* Div chứa thông tin phụ huynh */}
                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            padding: "20px 18px",
                            backgroundColor: "#FFF",
                            borderRadius: "16px",
                            gap: "16px"
                        }}
                    >
                        <Title style={{ margin: 0, fontWeight: 500, fontSize: "14px" }}>Thông tin liên hệ</Title>

                        <Input
                            placeholder="Tên phụ huynh"
                            value={newParentName}
                            onChange={(e) => setNewParentName(e.target.value)}
                            style={{
                                padding: "8px 12px",
                                height: "40px",
                                borderRadius: "12px",
                                color: "#E2E8F0",
                                fontWeight: 400,
                                fontSize: "16px"
                            }}
                        />

                        <Input
                            placeholder="Số điện thoại phụ huynh"
                            value={newParentPhone}
                            onChange={(e) => setNewParentPhone(e.target.value)}
                            style={{
                                padding: "8px 12px",
                                height: "40px",
                                borderRadius: "12px",
                                color: "#E2E8F0",
                                fontWeight: 400,
                                fontSize: "16px"
                            }}
                        />

                        <Input
                            placeholder="Email nhận hóa đơn điện tử"
                            value={newParentEmail}
                            onChange={(e) => setNewParentEmail(e.target.value)}
                            style={{
                                padding: "8px 12px",
                                height: "40px",
                                borderRadius: "12px",
                                color: "#E2E8F0",
                                fontWeight: 400,
                                fontSize: "16px"
                            }}
                        />
                    </div>
                </div>

                {/* Div chứa nút thêm học sinh */}
                <div
                    style={{
                        width: "100%",
                        padding: "12px 18px"
                    }}
                >
                    <Button
                        onClick={handleAddStudent}
                        style={{
                            width: "100%",
                            height: "40px",
                            borderRadius: "8px",
                            backgroundColor: "#f2f9ff",
                            color: "#008AFF",
                            fontWeight: 500,
                            fontSize: "16px"
                        }}
                    >
                        Thêm học sinh
                    </Button>

                </div>
            </Modal>


            {/* Modal xem thông tin học sinh */}
            <Modal
                open={isViewModalOpen}
                footer={null}
                width={400}
                closeIcon={null}
                style={{
                    top: 0, marginRight: 0
                }}
            >
                {/* Thanh tiêu đề xem thông tin học sinh */}
                <div
                    style={{
                        display: "flex",
                        width: "100%",
                        height: "58px",
                        alignItems: "center",
                        paddingLeft: "24px"
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px"
                        }}
                    >
                        <img src="src/assets/Close.png"
                            onClick={() => setIsViewModalOpen(false)}
                            style={{
                                width: "16px",
                                height: "16px"
                            }}
                        />

                        {/* Thanh bar nằm giữa */}
                        <div
                            style={{
                                width: "0px",
                                height: "16px",
                                border: "1px solid #E2E8F0",
                            }}
                        ></div>


                        <Title style={{ margin: 0, fontWeight: 500, fontSize: "18px" }}>
                            Thông tin học sinh
                        </Title>
                    </div>
                </div>


                <div
                    style={{
                        width: "100%",
                        height: "902px",
                        padding: "16px 16px 0",
                        backgroundColor: "#F5F5F5",
                    }}
                >

                    {/* Div hiện thông tin họ tên, mã học sinh, loại miễn giảm */}
                    <div
                        style={{
                            width: "100%",
                            backgroundColor: "#FFF",
                            borderRadius: "12px",
                            marginBottom: "18px"
                        }}
                    >
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <tbody>
                                <tr>
                                    <td style={{ width: "34%", padding: "13px 16px", borderBottom: "1px solid #f2f2f2" }}>
                                        <Text style={{ fontWeight: 500, fontSize: "14px", color: "#4B4B4B" }}>Họ và tên</Text>
                                    </td>
                                    <td style={{ padding: "13px 16px", borderBottom: "1px solid #f2f2f2" }}>
                                        <Text style={{ fontWeight: 400, fontSize: "14px", color: "#64748B" }}>
                                            {currentStudent?.name || "—"}
                                        </Text>
                                    </td>
                                </tr>

                                <tr>
                                    <td style={{ width: "34%", padding: "13px 16px", borderBottom: "1px solid #f2f2f2" }}>
                                        <Text style={{ fontWeight: 500, fontSize: "14px", color: "#4B4B4B" }}>Mã học sinh</Text>
                                    </td>
                                    <td style={{ padding: "13px 16px", borderBottom: "1px solid #f2f2f2" }}>
                                        <Text style={{ fontWeight: 400, fontSize: "14px", color: "#64748B" }}>
                                            {currentStudent?.code || "—"}
                                        </Text>
                                    </td>
                                </tr>

                                <tr>
                                    <td style={{ width: "34%", padding: "13px 16px" }}>
                                        <Text style={{ fontWeight: 500, fontSize: "14px", color: "#4B4B4B" }}>Loại miễn giảm</Text>
                                    </td>
                                    <td style={{ padding: "13px 16px" }}>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            {currentStudent?.feeReductionTypes?.length === 0 ? (
                                                <Text style={{ textAlign: "center", padding: "1px 6px", borderRadius: "8px", backgroundColor: "#94A3B8", color: "#FFF", fontSize: "12px" }}>
                                                    Không có
                                                </Text>
                                            ) : (
                                                currentStudent?.feeReductionTypes?.map((discount, idx) => (
                                                    <Text
                                                        key={idx}
                                                        style={{
                                                            textAlign: "center",
                                                            padding: "1px 6px",
                                                            borderRadius: "8px",
                                                            fontSize: "12px",
                                                            color: "#FFF",
                                                            backgroundColor: getDiscountColor(discount),
                                                        }}
                                                    >
                                                        {discount}
                                                    </Text>
                                                ))
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>



                    {/* Div hiện thông tin trường, niên khóa, lớp của học sinh */}
                    <div
                        style={{
                            width: "100%",
                            backgroundColor: "#FFF",
                            borderRadius: "12px",
                            marginBottom: "18px"
                        }}
                    >
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <tbody>
                                <tr>
                                    <td style={{ width: "34%", padding: "13px 16px", borderBottom: "1px solid #f2f2f2" }}>
                                        <Text style={{ fontWeight: 500, fontSize: "14px", color: "#4B4B4B" }}>Trường</Text>
                                    </td>
                                    <td style={{ padding: "13px 16px", borderBottom: "1px solid #f2f2f2" }}>
                                        <Text style={{ fontWeight: 400, fontSize: "14px", color: "#64748B" }}>
                                            {currentStudent?.class?.school?.name}
                                        </Text>
                                    </td>
                                </tr>

                                <tr>
                                    <td style={{ width: "34%", padding: "13px 16px", borderBottom: "1px solid #f2f2f2" }}>
                                        <Text style={{ fontWeight: 500, fontSize: "14px", color: "#4B4B4B" }}>Niên khóa</Text>
                                    </td>
                                    <td style={{ padding: "13px 16px", borderBottom: "1px solid #f2f2f2" }}>
                                        <Text style={{ fontWeight: 400, fontSize: "14px", color: "#64748B" }}>
                                            {currentStudent?.class?.schoolYear.replace("-"," - ")}
                                        </Text>
                                    </td>
                                </tr>

                                <tr>
                                    <td style={{ width: "34%", padding: "13px 16px" }}>
                                        <Text style={{ fontWeight: 500, fontSize: "14px", color: "#4B4B4B" }}>Lớp</Text>
                                    </td>
                                    <td style={{ padding: "13px 16px" }}>
                                        <Text style={{ fontWeight: 400, fontSize: "14px", color: "#64748B" }}>
                                            {currentStudent?.class?.name}
                                        </Text>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>



                    {/* Div chứa thông tin phụ huynh học sinh*/}
                    <div
                        style={{
                            width: "100%",
                            backgroundColor: "#FFF",
                            borderRadius: "12px",
                        }}
                    >
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <tbody>
                                <tr>
                                    <td style={{ width: "34%", padding: "13px 16px", borderBottom: "1px solid #f2f2f2" }}>
                                        <Text style={{ fontWeight: 500, fontSize: "14px", color: "#4B4B4B" }}>Tên phụ huynh</Text>
                                    </td>
                                    <td style={{ padding: "13px 16px", borderBottom: "1px solid #f2f2f2" }}>
                                        <Text style={{ fontWeight: 400, fontSize: "14px", color: "#64748B" }}>
                                            {currentStudent?.parentName || "—"}
                                        </Text>
                                    </td>
                                </tr>

                                <tr>
                                    <td style={{ width: "34%", padding: "13px 16px", borderBottom: "1px solid #f2f2f2" }}>
                                        <Text style={{ fontWeight: 500, fontSize: "14px", color: "#4B4B4B" }}>Email</Text>
                                    </td>
                                    <td style={{ padding: "13px 16px", borderBottom: "1px solid #f2f2f2" }}>
                                        <Text style={{ fontWeight: 400, fontSize: "14px", color: "#64748B" }}>
                                            {/* {currentStudent?.parent.email || "—"} */}
                                        </Text>
                                    </td>
                                </tr>

                                <tr>
                                    <td style={{ width: "34%", padding: "13px 16px" }}>
                                        <Text style={{ fontWeight: 500, fontSize: "14px", color: "#4B4B4B" }}>Số điện thoại</Text>
                                    </td>
                                    <td style={{ padding: "13px 16px" }}>
                                        <Text style={{ fontWeight: 400, fontSize: "14px", color: "#64748B" }}>
                                            {currentStudent?.parentPhoneNumber || "—"}
                                        </Text>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>





                </div>

                {/* Button delete + button chỉnh sửa */}
                <div
                    style={{
                        width: "100%",
                        padding: "12px 16px"
                    }}
                >
                    <div style={{ width: "100%", display: "flex", gap: "12px", alignItems: "center" }}>
                        <Button style={{ width: "40px", height: "40px", outline: "none", borderRadius: "8px" }}>
                            <img style={{ width: "40px", height: "40px", objectFit: "contain" }} src="src/assets/delete.png" />
                        </Button>


                        <Button
                            onClick={() => {
                                const gradeName = grade.find(g => g.id === currentStudent?.class.gradeId)?.name;

                                if (!currentStudent) return;
                                
                                setEditSchool(currentStudent?.class?.school?.name)
                                setEditStudentCode(currentStudent.code)
                                setEditSchoolYearName(currentStudent.class.schoolYear)
                                setEditDiscounts(currentStudent.feeReductionTypes)
                                setEditGradeName(gradeName || "");
                                setEditStudentName(currentStudent.name)
                                setEditClassName(currentStudent.class.name)
                                setEditClassID(currentStudent.class.id)
                                setEditParentName(currentStudent.parentName || "");
                                setEditParentPhone(currentStudent.parentPhoneNumber || "");
                                setEditParentEmail("");
                                setIsUpdateModalOpen(true)
                            }}
                            style={{ flex: 1, outline: "none", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", borderRadius: "8px", backgroundColor: "#f2f9ff" }}>
                            <Text style={{ fontWeight: 500, fontSize: "16px", color: "#008AFF" }}>Chỉnh sửa</Text>
                            <img style={{ width: "18px", height: "18px", objectFit: "contain" }} src="src/assets/Edit (1).png" />
                        </Button>

                    </div>
                </div>
            </Modal>

            {/*Modal chỉnh sửa thông tin học sinh*/}
            <Modal
                open={isUpdateModalOpen}
                footer={null}
                width={400}
                closeIcon={null}
                style={{
                    top: 0, marginRight: 0
                }}
            >
                <div
                    style={{
                        display: "flex",
                        width: "100%",
                        height: "58px",
                        alignItems: "center",
                        paddingLeft: "24px"
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "16px"
                        }}
                    >
                        <img src="src/assets/Close.png"
                            onClick={() => setIsUpdateModalOpen(false)}
                            style={{
                                width: "16px",
                                height: "16px"
                            }}
                        />

                        {/* Thanh bar nằm giữa */}
                        <div
                            style={{
                                width: "0px",
                                height: "16px",
                                border: "1px solid #E2E8F0",
                            }}
                        ></div>


                        <Title style={{ margin: 0, fontWeight: 500, fontSize: "18px" }}>
                            Sửa thông tin
                        </Title>
                    </div>
                </div>

                <div
                    style={{
                        width: "100%",
                        height: "902px",
                        padding: "16px 16px 0",
                        backgroundColor: "#F5F5F5",
                    }}
                >
                    {/* Div bọc chỉnh sửa thông tin học sinh */}
                    <div
                        style={{
                            width: "100%",
                            backgroundColor: "#FFF",
                            borderRadius: "12px",
                            marginBottom: "18px",
                            paddingTop: "12px"
                        }}
                    >
                        <div style={{ padding: "8px 18px" }}>
                            <Title style={{ margin: 0, fontWeight: 500, fontSize: "14px" }}>Thông tin học sinh</Title>
                        </div>

                        <div style={{ padding: "8px 18px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                            <div style={{ display: "flex", gap: "12px", height: "38px" }}>
                                <div style={{ width: "80px", display: "flex", alignItems: "center" }}>
                                    <Text style={{ fontWeight: 500, fontSize: "12px" }}>Tên trường</Text>
                                </div>
                                <Input
                                    value={editSchool}
                                    // onChange={(e) => setEditSchool(e.target.value)}
                                    style={{ borderRadius: "12px", padding: "7px 12px", flex: 1, backgroundColor: "#E2E8F0", color: "#CBD5E1", fontWeight: 400, fontSize: "16px" }}
                                    placeholder="TPHP TP.Hồ Chí Minh"
                                />
                            </div>

                            <div style={{ display: "flex", gap: "12px", height: "38px" }}>
                                <div style={{ width: "80px", display: "flex", alignItems: "center" }}>
                                    <Text style={{ fontWeight: 500, fontSize: "12px" }}>Mã học sinh</Text>
                                </div>
                                <Input
                                    value={editStudentCode}
                                    onChange={(e) => setEditStudentCode(e.target.value)}
                                    style={{ borderRadius: "12px", padding: "7px 12px", flex: 1, backgroundColor: "#E2E8F0", color: "#CBD5E1", fontWeight: 400, fontSize: "16px" }}
                                    placeholder="79032"
                                />
                            </div>

                            <div style={{ display: "flex", gap: "12px", height: "38px" }}>
                                <div style={{ width: "80px", display: "flex", alignItems: "center" }}>
                                    <Text style={{ fontWeight: 500, fontSize: "12px" }}>Niên khóa</Text>
                                </div>
                                <Input
                                    value={editSchoolYearName}
                                    // onChange={(e) => setEditSchoolYearName(e.target.value)}
                                    style={{ borderRadius: "12px", padding: "7px 12px", flex: 1, backgroundColor: "#E2E8F0", color: "#CBD5E1", fontWeight: 400, fontSize: "16px" }}
                                    placeholder="2012-2013"
                                />
                            </div>

                            <div style={{ display: "flex", gap: "12px", height: "38px" }}>
                                <div style={{ width: "80px", display: "flex", alignItems: "center" }}>
                                    <Text style={{ fontWeight: 500, fontSize: "12px" }}>Khối</Text>
                                </div>
                                <Input
                                    value={editGradeName}
                                    // onChange={(e) => setEditGradeName(e.target.value)}
                                    style={{ borderRadius: "12px", padding: "7px 12px", flex: 1, backgroundColor: "#E2E8F0", color: "#CBD5E1", fontWeight: 400, fontSize: "16px" }}
                                    placeholder="06"
                                />
                            </div>

                            <Input
                                value={editStudentName}
                                onChange={(e) => setEditStudentName(e.target.value)}
                                placeholder="Tên học sinh"
                                style={{ borderRadius: "12px", height: "40px", padding: "8px 12px", fontWeight: 400, fontSize: "16px", color: "#94A3B8" }}
                            />


                            <Select
                                value={editClassID}
                                onChange={(value) => setEditClassID(value)}
                                placeholder="Chọn lớp"
                                options={
                                    classes.map(item => ({
                                        label: item.name,
                                        value: item.id
                                    }))
                                }
                                style={{ borderRadius: "12px", fontWeight: 400, fontSize: "16px", color: "#94A3B8" }}
                                suffixIcon={
                                    <img src="/src/assets/Down (2).png"
                                    />
                                }
                            />
                        </div>
                    </div>

                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            backgroundColor: "#FFF",
                            borderRadius: "12px",
                            marginBottom: "18px"
                        }}
                    >
                        <div style={{ padding: "20px 18px 0", width: "100%", display: "flex", flexDirection: "column", marginBottom: "8px" }}>
                            <Title style={{ margin: 0, fontWeight: 500, fontSize: "14px", color: "#334155" }}>Loại miễn giảm học phí</Title>
                        </div>

                        {/* List loại miễn giảm */}
                        <div style={{ padding: "8px 18px", width: "100%", marginBottom: "12px" }}>

                            <Checkbox.Group
                                value={editDiscounts}
                                onChange={(list) => setEditDiscounts(list)}
                                style={{ width: "100%", display: "flex", flexDirection: "column", gap: "12px" }}
                            >
                                {discountOptions.map((item) => (
                                    <div
                                        key={item.value}
                                        style={{ width: "100%", display: "flex", gap: "24px", alignItems: "center" }}
                                    >
                                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                            <Checkbox value={item.value} />
                                            <Text style={{ fontWeight: 600, fontSize: "14px" }}>{item.label}</Text>
                                        </div>

                                        <div style={{ flex: 1, border: "1px solid #E2E8F0", borderStyle: "dashed" }} />

                                        <Text style={{ fontSize: "14px", fontWeight: 600, color: "#0C9D61" }}>
                                            {item.amount}
                                        </Text>
                                    </div>
                                ))}
                            </Checkbox.Group>
                        </div>
                    </div>


                    <div
                        style={{
                            width: "100%",
                            display: "flex",
                            flexDirection: "column",
                            padding: "20px 18px",
                            backgroundColor: "#FFF",
                            borderRadius: "16px",
                            gap: "16px"
                        }}
                    >
                        <Title style={{ margin: 0, fontWeight: 500, fontSize: "14px" }}>Thông tin liên hệ</Title>

                        <Input
                            placeholder="Tên phụ huynh"
                            value={editParentName}
                            onChange={(e) => setEditParentName(e.target.value)}
                            style={{
                                padding: "8px 12px",
                                height: "40px",
                                borderRadius: "12px",
                                color: "#E2E8F0",
                                fontWeight: 400,
                                fontSize: "16px"
                            }}
                        />

                        <Input
                            placeholder="Số điện thoại phụ huynh"
                            value={editParentPhone}
                            onChange={(e) => setEditParentPhone(e.target.value)}
                            style={{
                                padding: "8px 12px",
                                height: "40px",
                                borderRadius: "12px",
                                color: "#E2E8F0",
                                fontWeight: 400,
                                fontSize: "16px"
                            }}
                        />

                        <Input
                            // placeholder="Email nhận hóa đơn điện tử"
                            value={editParentEmail}
                            // onChange={(e) => setEditParentEmail(e.target.value)}
                            style={{
                                padding: "8px 12px",
                                height: "40px",
                                borderRadius: "12px",
                                color: "#E2E8F0",
                                fontWeight: 400,
                                fontSize: "16px"
                            }}
                        />
                    </div>
                </div>

                <div
                    style={{
                        padding: "12px 18px"
                    }}
                >
                    <Button 
                    onClick={handleUpdateStudent} 
                    style={{ width: "100%", height: "40px", color: "#008AFF", backgroundColor: "#f2f9ff", fontWeight: 500, fontSize: "16px", outline: "none", borderRadius: "8px" }}>
                        Cập nhật
                    </Button>
                </div>

            </Modal>



            <style>
                {
                    `
            .leftSectionContent::-webkit-scrollbar {
                width: 0px !important;
                background: transparent !important
            }
            
            .grade-button:hover {
            border-color: #008AFF !important;
            color: #008AFF !important;
            }

            .grade-button-modal:hover {
            border-color: #008AFF !important;
            color: #008AFF !important;
            }

            .ant-table-thead > tr > th::before {
            display: none !important;
            }

            .ant-checkbox-inner {
            border-radius: 2px !important
            }

            .ant-checkbox-checked .ant-checkbox-inner {
            border-radius: 2px !important
            }

            .ant-table-selection-column {
            width: 7% !important;
            padding: 16px 24px !important;
            }

            .ant-table-row-selected > td {
            background-color: transparent !important
            }

            .ant-modal-content {
            padding: 0 !important;
            border-radius: 0 !important;
            }

            .ant-select.ant-select-single {
            height: 40px !important
            }

            
            .ant-select-selector{
                display: flex !important;
                align-items: center !important;
                padding: 0px 12px !important;
                border-radius: 12px !important;
                box-shadow: none !important;
            }

            .ant-select-selection-placeholder,
            .ant-select-selection-item {
                font-weight: 400 !important;
                font-size: 16px !important;
            }
            
            .right-container::-webkit-scrollbar {
                width: 0px !important;
                background: transparent !important
            }

            .grade-select-in-modal::-webkit-scrollbar {
                height: 0px !important;
                background: transparent !important;
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

          body::-webkit-scrollbar {
            display: none;
         }

        


            `
                }
            </style>
        </>
    );
}

export default StudentManagement;
