import React, { useEffect, useState, useRef } from 'react'
import { useOutletContext, useNavigate } from "react-router-dom";
import { Typography, Button, Modal, Input, Select, Card } from "antd";
import { useGrade } from "../context/GradeContext";
import { useSchoolYear } from "../context/SchoolYearContext";
import { useClass} from "../context/ClassContext";
import { useStudent } from "../context/StudentContext";
const { Title, Text } = Typography;
type ContextType = { setPageTitle: (title: string) => void };



function ClassManagement() {

    const { setPageTitle } = useOutletContext<ContextType>();

    
    const teacherSelect = useRef<any>(null);

    const { grade } = useGrade();
    const { schoolYears } = useSchoolYear();
    const { classes, setClasses} = useClass();
    const { students } = useStudent();

    // Hàm đếm học sinh theo lớp
    const countStudentsByClasses = (classID: number | null) => {
        if (classID === null) return 0;
        return students.filter(student => student.classID === classID).length;
    }

    // Set hiệu ứng cho lựa chọn niên khóa và khối khi click
    const [activeGrade, setActiveGrade] = useState<number | null>(null);
    const [activeYear, setActiveYear] = useState<number | null>(null);


    const [newClassName, setNewClassName] = useState("");
    const [newGradeID, setNewGradeID] = useState<number | null>(null);
    const [newYearID, setNewYearID] = useState<number | null>(null);
    const [newTeacherID, setNewTeacherID] = useState<number | null>(null);

    const [editClassName, setEditClassName] = useState("");
    const [editGradeID, setEditGradeID] = useState<number | null>(null);
    const [editYearID, setEditYearID] = useState<number | null>(null);
    const [editTeacherID, setEditTeacherID] = useState<number | null>(null);


    // item được chọn 
    const [selectedClass, setSelectedClass] = useState<any>(null);

    // state khi hover grade và hover niên khóa
    const [hoverGrade, setHoverGrade] = useState<number | null>(null);
    const [hoverYear, setHoverYear] = useState<number | null>(null);

    // state khi hover Card
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);





    // hàm thêm lớp
    const handleAddClass =  () => {
        if(!newClassName || !newGradeID || !newYearID || !newTeacherID ) return;

        setClasses((prev) => {
            const newClass = {
                id: prev.length? prev[prev.length - 1].id + 1: 1,
                name: newClassName,
                gradeID: newGradeID,
                schoolYearID: newYearID,
                teacherID: newTeacherID ?? null
            };
            return [...prev, newClass];
        });

        // reset form
        setNewClassName("");
        setNewGradeID(null);
        setNewYearID(null);
        setNewTeacherID(null);

        setIsAddModalOpen(false);
    };


    // hàm chỉnh sửa lớp
    const handleUpdateClass = () => {
    if (!selectedClass) return;

    setClasses(prev =>
        prev.map(cls =>
            cls.id === selectedClass.id
                ? {
                    ...cls,
                    name: editClassName,
                    gradeID: editGradeID,
                    schoolYearID: editYearID,
                    teacherID: editTeacherID
                }
                : cls
        )
    );

    setIsUpdateModalOpen(false);
};

    // hàm xóa lớp
    const handleDeleteClass = () => {
        if (!selectedClass) return;

        setClasses(prev => prev.filter(cls => cls.id !== selectedClass.id));
        setIsDeleteModalOpen(false);
        setConfirmText("");
    };

    // hàm chuyển trang khi click danh sách học sinh
    const navigate = useNavigate();

    const handleStudentList = (classID: number) => {
        navigate(`/student?classID=${classID}`);
    }

    


    // hàm hiển thị lọc Card lớp theo niên khóa và khối
    
    const filteredClasses = classes.filter((cls) => {
        
        const matchGrade = activeGrade === null ? true : cls.gradeID === activeGrade;

        const matchYear = activeYear === null ? true : activeYear === -1 ? true: cls.schoolYearID === activeYear;

        return matchGrade && matchYear;
    });
    
    

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    // Danh sách giáo viên chủ nhiệm
    const teachers = [
        { id: 1, name: "Hoàng Anh" },
        { id: 2, name: "Lan Anh"}
    ]


    useEffect(() => {
        setPageTitle("Quản lý lớp học");
    }, [setPageTitle]);

    const styles = {
        classHeader: {
            width: "100%",
            height: "60px",
            padding: "10px 24px",
            display: "flex",
            alignItems: "center"
        },

        classTitle: {
            fontWeight: 600,
            fontSize: "18px",
            margin: 0,
        },

        classToolBar: {
            width: "100%",
            display: "flex",
            flexDirection: "column" as const,
        },

        addClassWrapper: {
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 24px",
            height: "52.8px"
        },

        addClassBtn: {
            width: "106px",
            height: "40px",
            borderRadius: "8px",
            border: "1px solid #008AFF",
            color: "#008AFF",
            fontWeight: 500,
            fontSize: "16px",
            outline: "none",
            boxShadow: "none"
        },

        cardTypeBtn: {
            fontSize: "16px",
            fontWeight: 400,
            color: "#008AFF",
            gap: "10px"
        },

        gradeLevelWrapper: {
            width: "100%",
            marginTop: "12px",
            padding: "0 24px",
            height: "42px",
            display: "flex",
            alignItems: "center",
            gap: "32px",
            position: "relative" as const
        },

        underlineAll: {
            position: "absolute" as const,
            bottom: 0,
            left: "24px",
            right: "24px",
            height: "1px",
            backgroundColor: "#E2E8F0"
        },

        yearAndClassContainer: {
            display: "flex",
            flex: "1",
            height: "100%",
            paddingTop: "28px",
            paddingBottom: "28px",
            gap: "24px",
            minHeight: 0,
            paddingRight: "24px",
        },

        yearWrapper: {
            width: "143px",
            paddingLeft: "24px",
            overflowY: "auto" as const,
            height: "100%"
        },

        yearContent: {
            width: "100%"
        },

        yearTitleWrapper: {
            padding: "9px 12px",
            display: "flex",
            alignItems: "center"
        },

        classWrapper: {
            flex: 1,
            // paddingRight: "24px",
            overflowY: "auto" as const
        },

        classCardContainer: {
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: "14px",
        },

        classNameInput: {
            height: "40px",
            borderRadius: "8px",
            padding: "8px 12px",
            fontWeight: 400,
            fontSize: "16px",
            color: "#94A3B8",
            boxShadow: "none"
        },

        cardHeaderContainer: {
            display: "flex",
            flexDirection: "column" as const,
            gap: "9px"
        },

        cardButtonContainer: {
            display: "flex",
            gap: "8px",
            width: "100%"
        }

    }

    return (
        <>
            <div style={{height: "100%", maxWidth: "1012px", display: "flex", flexDirection: "column" as const, overflow: "hidden"}}>

                {/* tiêu đề trang */}
                <div style={styles.classHeader}>
                    <Title style={styles.classTitle}>Quản lý lớp học</Title>
                </div>


                {/* container chứa hai button + tên khối  */}
                <div style={styles.classToolBar}>
                    <div style={styles.addClassWrapper}>

                        {/* container xem dạng thẻ  */}
                        <div style={{ height: "100%", width: "169px", display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "12px", padding: "8px", backgroundColor: "#F2F4F7" }}>
                            <Button className="custom-roboto-font" style={styles.cardTypeBtn}>
                                <img src="/src/assets/Icon-Wrapper.png" />
                                Xem dạng thẻ
                            </Button>
                        </div>

                        {/* button thêm lớp */}
                        <Button onClick={() => setIsAddModalOpen(true)} style={styles.addClassBtn}>Thêm lớp</Button>
                    </div>

                    {/*container chứa khối */}
                    <div style={styles.gradeLevelWrapper}>
                        <div style={styles.underlineAll}></div>
                        {grade.map((grade) => (
                            <div
                                key={grade.id}
                                onMouseEnter={() => setHoverGrade(grade.id)}
                                onMouseLeave={() => setHoverGrade(null)} 
                                style={{
                                    cursor: "pointer",
                                    position: "relative",
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center"
                                }}
                                onClick={() => setActiveGrade(activeGrade === grade.id ? null : grade.id)}
                            >
                                <Text
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: 400,
                                        color: activeGrade === grade.id || hoverGrade === grade.id? "#008AFF" : "#94A3B8",
                                    }}>
                                    {grade.name}
                                </Text>

                                {/* Line xanh khi grade được click */}

                                {(activeGrade === grade.id || hoverGrade === grade.id) && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            height: "3px",
                                            backgroundColor: "#008AFF",
                                            borderRadius: "2px"
                                        }}
                                    >
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                </div>


                {/* Container chứa list niên khóa và thẻ lớp */}
                <div style={styles.yearAndClassContainer}>

                    <div className="yearWrapper" style={styles.yearWrapper}>
                        <div style={styles.yearContent}>

                            {/*Tiêu đề Niên khóa*/}
                            <div style={styles.yearTitleWrapper}>
                                <Text style={{ fontWeight: 400, fontSize: "12px", color: "#94A3B8" }}>Niên khóa</Text>
                            </div>


                            {/*Hiển thị niên khóa để hiển thị các lớp thuộc 1 niên khóa cố định*/}

                            {/*Sort theo thứ tự giảm dần*/}
                            {[...schoolYears]
                                .sort((a, b) => {
                                    const startA = Number(a.year.split(" - ")[0]);
                                    const startB = Number(b.year.split(" - ")[0]);
                                    return startB - startA
                                })
                                .map((year) => (
                                    <div
                                        key={year.id}
                                        onClick={() => setActiveYear(year.id)}
                                        onMouseEnter={() => setHoverYear(year.id)}
                                        onMouseLeave={() => setHoverYear(null)}
                                        style={{
                                            cursor: "pointer",
                                            height: "36px",
                                            padding: "2px 4px"
                                        }}
                                    >
                                        <div style={{
                                            display: "flex",
                                            padding: "5px 19px",
                                            alignItems: "center",
                                            width: "100%",
                                            height: "100%",
                                            borderRadius: "8px",
                                            backgroundColor: activeYear === year.id || hoverYear === year.id ? "#f2f9ff" : "#FFFFFF",
                                        }}>
                                            <Text
                                                style={{
                                                    fontWeight: 400,
                                                    fontSize: "14px",
                                                    color: activeYear === year.id || hoverYear === year.id ? "#008AFF" : "#334155"
                                                }}
                                            >
                                                {year.year.replaceAll(' ', '')}
                                            </Text>
                                        </div>
                                    </div>
                                )
                                )}


                            {/* Nút tất cả để hiển thị tất cả các lớp  */}
                            <div
                                onClick={() => setActiveYear(-1)}
                                onMouseEnter={() => setHoverYear(-1)}
                                onMouseLeave={() => setHoverYear(null)}
                                style={{
                                    cursor: "pointer",
                                    height: "36px",
                                    padding: "2px 4px"
                                }}>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "5px 19px",
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: "8px",
                                        backgroundColor: activeYear === -1 || hoverYear === -1 ? "#f2f9ff" : "#FFFFFF",
                                    }}>
                                    <Text style={{
                                        fontWeight: 400,
                                        fontSize: "14px",
                                        color: activeYear === -1 || hoverYear === -1? "#008AFF" : "#334155"
                                    }}>Tất cả</Text>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thanh bar nằm giữa list niên khóa và thẻ  */}
                    <div style={{
                        border: "1px solid #E2E8F0",
                        height: "100%",
                        width: 0
                    }}
                    >
                    </div>
                    



                    <div className="class-card-container" style={styles.classWrapper}>
                        <div style={styles.classCardContainer}>
                            {filteredClasses.map((cls) => 
                            (
                                <Card
                                key={cls.id}
                                onMouseEnter={() => setHoveredCard(cls.id)}
                                onMouseLeave={() => setHoveredCard(null)}
                                bodyStyle={{
                                    padding: "16px",
                                    display: "flex",
                                    flexDirection: "column" as const,
                                    justifyContent: "space-between",
                                    gap: "18px",
                                }}
                                style={{
                                    border: "none",
                                    boxShadow: hoveredCard === cls.id ? "0px 4px 10px 0px rgba(0,0,0,0.08), 0px 1px 4px 0px rgba(0,0,0,0.04)"  : "0px 1px 1px 0px rgba(0,0,0,0.02), 0px 2px 4px 0px rgba(0,0,0,0.04)"
                                }}
                                >
                                    <div style={styles.cardHeaderContainer}>
                                        <div style={{display: "flex", alignItems: "center", gap: "5px"}}>
                                        <Title style={{margin: 0, fontWeight: 700, fontSize: "16px"}}> Lớp {cls.name}</Title>
                                        <Text style={{margin: 0, fontWeight: 300, fontSize: "16px" }}>
                                            (
                                                {
                                                    schoolYears.find((y) => y.id === cls.schoolYearID)?.year
                                                }
                                            )
                                        </Text>
                                        </div>

                                        <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                                            <img src="/src/assets/user.png" style={{width: "20px", height: "20px", objectFit: "contain"}} />
                                            <Text style={{fontWeight: 500, fontSize: "14px", color: "#94A3B8"}}>{countStudentsByClasses(cls.id)} học sinh</Text>
                                        </div>

                                        <div style={{display: "flex", alignItems: "center", gap: "8px"}}>
                                            <img src="/src/assets/Property 33.png" style={{width: "20px", height: "20px", objectFit: "contain"}} />
                                            <Text style={{fontWeight: 500, fontSize: "14px", color: "#94A3B8"}}>
                                                {
                                                    teachers.find((t) => t.id === cls.teacherID)?.name
                                                } (GVCN)</Text>
                                        </div>
                                    </div>

                                    <div style={styles.cardButtonContainer}>
                                        <Button 
                                       onClick={() => {
                                        setSelectedClass(cls);
                                        setIsDeleteModalOpen(true);
                                       }} 
                                       style={{width: "40px", height: "40px", outline: "none"}}><img src="/src/assets/delete.png"/></Button>

                                        <Button
                                        onClick={() => {
                                            setSelectedClass(cls);

                                            // fill dữ liệu lên form sửa
                                            setEditClassName(cls.name);
                                            setEditGradeID(cls.gradeID);
                                            setEditYearID(cls.schoolYearID);
                                            setEditTeacherID(cls.teacherID);

                                            setIsUpdateModalOpen(true);
                                        }}
                                        style={{width: "40px", height: "40px", outline: "none"}}><img src="/src/assets/edit.png"/></Button>

                                        <Button
                                        onClick={() => handleStudentList(cls.id)}
                                        style={{height: "40px", gap: "4px", fontSize: "16px", fontWeight: 500, color: "#008AFF", backgroundColor: "#e5f3ff"}}>
                                            Danh sách HS
                                            <img src="/src/assets/Drag.png"/>
                                        </Button>
                                    </div>
                                
                                </Card>
                            )

                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal thêm lớp */}
            <Modal
                open={isAddModalOpen}
                footer={null}
                width={400}
                closeIcon={null}
                style={{ top: 0, right: 0, marginRight: 0}}
                className="add-class-modal"
            >

                {/* Thanh tiêu đề thêm lớp */}
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
                            Thêm lớp
                        </Title>
                    </div>
                </div>


                {/* Nội dung thêm lớp */}
                <div
                    style={{
                        width: "100%",
                        height: "902px",
                        padding: "16px 16px 0",
                        backgroundColor: "#F5F5F5",
                    }}
                >

                    {/* Nội dung chính (ở giữa modal) */}
                    <div
                        style={{
                            width: "100%",
                            backgroundColor: "#FFFFFF",
                            padding: "20px 24px",
                            display: "flex",
                            gap: "18px",
                            flexDirection: "column" as const,
                            borderRadius: "12px"
                        }}>


                        {/* Thông tin lớp, khối, niên khóa */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column" as const,
                                gap: "12px"
                            }}
                        >
                            <Title style={{ margin: 0, width: "100%", fontWeight: 500, fontSize: "14px" }}>Thông tin lớp</Title>

                            <Input
                                placeholder="Tên lớp"
                                value={newClassName}
                                onChange={(e) => setNewClassName(e.target.value)}
                                style={styles.classNameInput}
                            />

                            <Select
                                placeholder="Khối"
                                value={newGradeID}
                                onChange={(v) => setNewGradeID(v)}
                                suffixIcon={
                                    <img src="/src/assets/Down (2).png"
                                    />
                                }
                                options={
                                    grade.map((g) => ({
                                        label: g.name,
                                        value: g.id
                                    }))
                                }
                            />


                            <Select
                                placeholder="Niên khóa"
                                value={newYearID}
                                onChange={(v) => setNewYearID(v)}
                                suffixIcon={
                                    <img src="/src/assets/Down (2).png"
                                    />
                                }
                                options={
                                    schoolYears.map((y) => ({
                                        label: y.year,
                                        value: y.id
                                    }))
                                }
                            />
                        </div>

                        {/*Select giáo viên chủ nhiệm */}
                        <div style={{
                            display: "flex",
                            flexDirection: "column" as const,
                            gap: "12px",
                        }}>
                            <Title style={{margin: 0, fontWeight: 500, fontSize: "14px"}}>Giáo viên chủ nhiệm</Title>
                            <Select
                            ref={teacherSelect}
                            showSearch
                            placeholder="Chọn giáo viên chủ nhiệm"
                            value={newTeacherID}
                            onChange={(v) => setNewTeacherID(v)}
                            suffixIcon={
                                <img src="/src/assets/search.png"
                                style={{cursor: "pointer"}}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    teacherSelect.current?.click();
                                }}
                                />
                            }
                            options={teachers.map((t) => ({
                                label: t.name,
                                value: t.id
                            }))}
                            optionFilterProp="label"
                            />

                        </div>
                    </div>


                </div>


                {/* Nút thêm lớp mới */}
                <div
                    style={{
                        width: "100%",
                        padding: "12px 18px"
                    }}
                >
                    <Button
                    onClick={handleAddClass}
                        style={{
                            width: "100%",
                            borderRadius: "8px",
                            color: "#008AFF",
                            backgroundColor: "#f2f9ff",
                            height: "40px",
                            fontWeight: 500,
                            fontSize: "16px"
                        }}
                    >
                        Thêm mới
                    </Button>
                </div>

            </Modal>



            {/* Modal chỉnh sửa thông tin lớp */}
            <Modal
                open={isUpdateModalOpen}
                footer={null}
                width={400}
                closeIcon={null}
                style={{ top: 0, right: 0, marginRight: 0}}
                className="add-class-modal"
            >

                {/* Thanh tiêu đề chỉnh sửa lớp */}
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


                {/* Nội dung chỉnh sửa lớp */}
                <div
                    style={{
                        width: "100%",
                        height: "902px",
                        padding: "16px 16px 0",
                        backgroundColor: "#F5F5F5",
                    }}
                >

                    {/* Nội dung chính (ở giữa modal) */}
                    <div
                        style={{
                            width: "100%",
                            backgroundColor: "#FFFFFF",
                            padding: "20px 24px",
                            display: "flex",
                            gap: "18px",
                            flexDirection: "column" as const,
                            borderRadius: "12px"
                        }}>


                        {/* Thông tin lớp, khối, niên khóa */}
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column" as const,
                                gap: "12px"
                            }}
                        >
                            <Title style={{ margin: 0, width: "100%", fontWeight: 500, fontSize: "14px" }}>Thông tin lớp</Title>

                            <Input
                                placeholder="Tên lớp"
                                value={editClassName}
                                onChange={(e) => setEditClassName(e.target.value)}
                                style={styles.classNameInput}
                            />

                            <Select
                                placeholder="Khối"
                                value={editGradeID}
                                onChange={(v) => setEditGradeID(v)}
                                suffixIcon={
                                    <img src="/src/assets/Down (2).png"
                                    />
                                }
                                options={
                                    grade.map((g) => ({
                                        label: g.name,
                                        value: g.id
                                    }))
                                }
                            />


                            <Select
                                placeholder="Niên khóa"
                                value={editYearID}
                                onChange={(v) => setEditYearID(v)}
                                suffixIcon={
                                    <img src="/src/assets/Down (2).png"
                                    />
                                }
                                options={
                                    schoolYears.map((y) => ({
                                        label: y.year,
                                        value: y.id
                                    }))
                                }
                            />
                        </div>

                        {/*Select giáo viên chủ nhiệm */}
                        <div style={{
                            display: "flex",
                            flexDirection: "column" as const,
                            gap: "12px",
                        }}>
                            <Title style={{margin: 0, fontWeight: 500, fontSize: "14px"}}>Giáo viên chủ nhiệm</Title>
                            <Select
                            showSearch
                            placeholder="Chọn giáo viên chủ nhiệm"
                            value={editTeacherID}
                            onChange={(v) => setEditTeacherID(v)}
                            suffixIcon={
                                <img src="/src/assets/search.png"
                                />
                            }
                            options={teachers.map((t) => ({
                                label: t.name,
                                value: t.id
                            }))}
                            optionFilterProp="label"
                            />

                        </div>
                    </div>


                </div>


                {/* Nút thêm lớp mới */}
                <div
                    style={{
                        width: "100%",
                        padding: "12px 18px"
                    }}
                >
                    <Button
                    onClick={handleUpdateClass}
                        style={{
                            width: "100%",
                            borderRadius: "8px",
                            color: "#008AFF",
                            backgroundColor: "#f2f9ff",
                            height: "40px",
                            fontWeight: 500,
                            fontSize: "16px"
                        }}
                    >
                        Cập nhật
                    </Button>
                </div>

            </Modal>







            {/* Modal xóa lớp */}
            <Modal
                    open={isDeleteModalOpen}
                    footer={null}
                    width={335}
                    closeIcon={null}
                    className="delete-class-modal"
                    centered
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
                        Xác nhận xóa lớp
                      </Title>
            
                      <Text style={{ fontWeight: 400, fontSize: "16px", marginBottom: "12px", lineHeight: "100%" }}>
                        Toàn bộ dữ liệu sẽ bị xóa <br />và không thể khôi phục
                      </Text>
                      <Input
                        placeholder="Nhập XACNHAN để xác nhận xóa lớp"
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
                          onClick={handleDeleteClass}
                          style={{ backgroundColor: "#FFEBEE", fontWeight: 500, fontSize: "16px", color: "#EC2D30", borderRadius: "8px", height: "40px", width: "106px" }}
                          danger
                          disabled={confirmText !== "XACNHAN"}
                        >
                          Xóa bỏ
                        </Button>
                      </div>
                    </div>
                  </Modal>






            {/* Chỉnh kiểu chữ cho text xem thẻ */}
            <style>
                {
                    `.custom-roboto-font * {
                        font-family: "Roboto, sans-serif" !important
                    }
                    
                    .add-class-modal .ant-modal-content {
                    padding: 0 !important
                    }

                    .add-class-modal .ant-modal-content {
                    border-radius: 0 !important
                    }

                    .delete-class-modal .ant-modal-content {
                    padding: 24px !important;
                    border-radius: 12px !important;
                    }

                    .ant-select.ant-select-single {
                    height: 40px !important;
                    }


                    .ant-select-selector{
                        display: flex !important;
                        align-items: center !important;
                        padding: 8px 12px !important;
                        border-radius: 12px !important;
                        box-shadow: none !important;
                    }

                    .ant-select-selection-placeholder,
                    .ant-select-selection-item {
                        font-weight: 400 !important;
                        font-size: 16px !important;
                    }

                    .class-card-container::-webkit-scrollbar {
                        display: none;
                    }

                    body::-webkit-scrollbar {
                        display: none;
                    }


                    .yearWrapper::-webkit-scrollbar {
                    width: 0px;
                    background: transparent;
                    }

                    `
                }
            </style>
        </>
    );
}

export default ClassManagement;