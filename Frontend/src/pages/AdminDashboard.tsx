import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

interface SignupRequest {
  id: number;
  employeeID: string;
  firstName: string;
  lastName: string;
  gender: string;
  bloodGroup: string;
  dateOfBirth: string;
  dateOfJoining: string;
  phoneNo: string;
  email: string;
  education: string;
  qualification: string;
  designation: string;
  requestedAt: string;
}

interface VerifiedEmployee {
  id: number;
  employeeID: string;
  firstName: string;
  lastName: string;
  gender: string;
  bloodGroup: string;
  dateOfBirth: string;
  dateOfJoining: string;
  phoneNo: string;
  email: string;
  education: string;
  qualification: string;
  designation: string;
  attendance: number;
  salary: number;
  rating: number;
  paidLeavesLeft: number;
  hiredAt: string;
}

interface AttendanceRecord {
  date: string;
  status: string;
  punchedInAt: string;
  punchedOutAt: string;
}

interface SalaryRecord {
  id: number;
  employeeID: string;
  month: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  generatedAt: string;
  payslipURL: string;
}

interface LeaveRequest {
  id: number;
  employeeID: string;
  fullName: string;
  startDate: string;
  endDate: string;
  type: string;
  reason: string;
  status: string;
  requestedAt: string;
  reviewedBy: string;
  reviewedAt: string;
}

interface UpdateEmployeeFormValues {
  firstName: string;
  lastName: string;
  gender: string;
  bloodGroup: string;
  dateOfBirth: string;
  phoneNo: string;
  email: string;
  education: string;
  qualification: string;
  designation: string;
  attendance: number;
  salary: number;
  rating: number;
  paidLeavesLeft: number;
}

export default function AdminDashboard() {
  const API = import.meta.env.VITE_API_BASE_URL;
  const [tab, setTab] = useState("signup");
  const [pendingSignups, setPendingSignups] = useState<SignupRequest[]>([]);
  const [employees, setEmployees] = useState<VerifiedEmployee[]>([]);
  const [selectedAttendance, setSelectedAttendance] = useState<
    AttendanceRecord[]
  >([]);
  const [selectedSalary, setSelectedSalary] = useState<SalaryRecord[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");
  const [presentToday, setPresentToday] = useState<number>(0);
  const [absentToday, setAbsentToday] = useState<number>(0);
  const [paidToday, setPaidToday] = useState<number>(0);
  const [unpaidToday, setUnpaidToday] = useState<number>(0);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState<number | null>(null);
  const [editEmployeeData, setEditEmployeeData] =
    useState<UpdateEmployeeFormValues | null>(null);
  const [selectedSignup, setSelectedSignup] = useState<SignupRequest | null>(
    null
  );
  const [selectedRole, setSelectedRole] = useState<"admin" | "employee">(
    "employee"
  );
  const [showEmployeeDetails, setShowEmployeeDetails] = useState(false);

  const headers = useCallback(
    () => ({
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
      },
    }),
    []
  );

  const fetchSignups = useCallback(async () => {
    const res = await axios.get(`${API}/api/admin/not-verified`, headers());
    setPendingSignups(res.data);
  }, [headers, API]);

  const fetchEmployees = useCallback(async () => {
    const res = await axios.get(`${API}/api/admin/employees`, headers());
    setEmployees(res.data);
  }, [headers, API]);

  const fetchLeaveRequests = useCallback(async () => {
    const res = await axios.get(`${API}/api/admin/leave-requests`, headers());
    setLeaveRequests(res.data);
  }, [headers, API]);

  const fetchTodayStats = useCallback(async () => {
    const [attRes, salRes] = await Promise.all([
      axios.get(`${API}/api/admin/today-attendance-summary`, headers()),
      axios.get(`${API}/api/admin/today-salary-summary`, headers()),
    ]);
    setPresentToday(attRes.data.present);
    setAbsentToday(attRes.data.absent);
    setPaidToday(salRes.data.paid);
    setUnpaidToday(salRes.data.unpaid);
  }, [headers, API]);

  useEffect(() => {
    fetchSignups();
    fetchEmployees();
    fetchLeaveRequests();
    fetchTodayStats();
  }, [fetchSignups, fetchEmployees, fetchLeaveRequests, fetchTodayStats]);

  const approveSignup = async (id: number) => {
    await axios.post(
      `${API}/api/admin/not-verified/${id}/approve`,
      { role: selectedRole },
      headers()
    );
    fetchSignups();
    setIsApproveDialogOpen(false);
  };

  const declineSignup = async (id: number) => {
    await axios.post(
      `${API}/api/admin/not-verified/${id}/decline`,
      {},
      headers()
    );
    fetchSignups();
  };

  const editEmployee = async (id: number, values: UpdateEmployeeFormValues) => {
    await axios.put(`${API}/api/admin/employees/${id}`, values, headers());
    fetchEmployees();
    setIsEditDialogOpen(false);
  };

  const openAttendanceDialog = async (employeeID: string) => {
    try {
      const res = await axios.get(
        `${API}/api/admin/attendance/${employeeID}`,
        headers()
      );
      if (res.data && Array.isArray(res.data)) {
        setSelectedAttendance(res.data);
        setSelectedEmployee(employeeID);
      } else {
        console.error("Invalid attendance data format");
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      alert("Failed to load attendance data. Please try again.");
    }
  };

  const openSalaryDialog = async (employeeID: string) => {
    const res = await axios.get(
      `${API}/api/admin/salary/${employeeID}`,
      headers()
    );
    setSelectedSalary(res.data);
    setSelectedEmployee(employeeID);
  };

  const openEditDialog = (employee: VerifiedEmployee) => {
    setEditEmployeeId(employee.id);
    setEditEmployeeData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      gender: employee.gender,
      bloodGroup: employee.bloodGroup,
      dateOfBirth: employee.dateOfBirth,
      phoneNo: employee.phoneNo,
      email: employee.email,
      education: employee.education,
      qualification: employee.qualification,
      designation: employee.designation,
      attendance: employee.attendance,
      salary: employee.salary,
      rating: employee.rating,
      paidLeavesLeft: employee.paidLeavesLeft,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="p-6 font-serif dark:bg-background text-foreground dark:text-cyan min-h-screen bg-zinc-200/90 bg-blend-overlay">
      <h1 className="text-3xl font-extrabold mb-16 text-center dark:text-cyan">
        Admin Dashboard
      </h1>

      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {["signup", "employees", "attendance", "salary", "leaves"].map(
          (key) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-6 py-2 rounded-full font-semibold border-2 transition-all duration-200 
              ${
                tab === key
                  ? "border-2 dark:border-cyan px-6 py-2 rounded-full font-semibold dark:bg-cyan dark:text-background bg-card text-cyan transition"
                  : "border-2 dark:border-cyan dark:text-cyan px-6 py-2 rounded-full font-semibold dark:hover:bg-cyan dark:hover:text-background hover:bg-card hover:text-cyan transition"
              }`}
            >
              {key.toUpperCase()}
            </button>
          )
        )}
      </div>

      <div className="space-y-6">
        {tab === "signup" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Signup Approvals</h2>
            {pendingSignups.length === 0 && (
              <p className="text-gray-500 text-2xl justify-center-safe text-center mt-40">
                No pending signups.
              </p>
            )}
            {pendingSignups.map((s) => (
              <div
                key={s.id}
                className="p-4 border dark:border-cyan rounded-lg shadow-md mb-3"
              >
                <p className="font-bold">
                  {s.firstName} {s.lastName} ({s.designation})
                </p>
                <div className="mt-2 space-x-2">
                  <button
                    onClick={() => {
                      setSelectedSignup(s);
                      setIsApproveDialogOpen(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-full"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => declineSignup(s.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded-full"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "employees" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Employees</h2>
            <p className="mb-2">Total Employees: {employees.length}</p>
            <div className="h-62 overflow-y-auto scrollbar-thin dark:hover:scrollbar-thumb-cyan dark:scrollbar-thumb-card dark:scrollbar-track-card hover:scrollbar-thumb-background hover:scrollbar-track-cyan mb-4 shadow-inner border dark:border-cyan rounded-lg p-4">
              <table className="min-w-full text-sm">
                <thead className="bg-muted/20 dark:bg-card">
                  <tr>
                    {[
                      "ID",
                      "EmployeeID",
                      "Name",
                      "Gender",
                      "Email",
                      "Phone",
                      "Join Date",
                      "Leaves",
                      "Update",
                      "Details",
                    ].map((h) => (
                      <th key={h} className="p-2 text-left">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.map((e) => (
                    <tr key={e.id} className="border-b dark:border-muted">
                      <td className="p-2">{e.id}</td>
                      <td>{e.employeeID}</td>
                      <td>
                        {e.firstName} {e.lastName}
                      </td>
                      <td>{e.gender}</td>
                      <td>{e.email}</td>
                      <td>{e.phoneNo}</td>
                      <td>{e.dateOfJoining}</td>
                      <td>{e.paidLeavesLeft}</td>
                      <td>
                        <button
                          onClick={() => openEditDialog(e)}
                          className="bg-blue-500 hover:bg-blue-700 text-white px-2 ml-3.5 py-0.5 rounded-full"
                        >
                          Edit
                        </button>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            setSelectedEmployee(e.employeeID);
                            setShowEmployeeDetails(true);
                          }}
                          className="bg-indigo-500 hover:bg-indigo-700 text-white px-2 ml-0.5 py-0.5 rounded-full"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "attendance" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Attendance Report</h2>
            <p className="mb-3">
              Present: {presentToday} | Absent: {absentToday}
            </p>
            <div className="h-62 overflow-y-auto scrollbar-thin dark:hover:scrollbar-thumb-cyan dark:scrollbar-thumb-card dark:scrollbar-track-card hover:scrollbar-thumb-background hover:scrollbar-track-cyan mb-4 shadow-inner border dark:border-cyan rounded-lg p-4">
              {employees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => openAttendanceDialog(emp.employeeID)}
                  className="cursor-pointer border p-3 rounded-lg mb-2 hover:bg-muted/10 dark:hover:bg-muted/20"
                >
                  {emp.employeeID} - {emp.firstName} {emp.lastName}
                </div>
              ))}
            </div>
            {selectedAttendance.length > 0 && (
              <div className="mt-6 p-4 border dark:border-cyan rounded-lg">
                <h3 className="font-semibold mb-3">
                  Attendance Details for {selectedEmployee}
                </h3>
                <div className="h-62 overflow-y-auto scrollbar-thin dark:hover:scrollbar-thumb-cyan dark:scrollbar-thumb-card dark:scrollbar-track-card hover:scrollbar-thumb-background hover:scrollbar-track-cyan mb-4">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Punched In</th>
                        <th>Punched Out</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedAttendance.map((rec, i) => (
                        <tr key={i}>
                          <td>{rec.date}</td>
                          <td>{rec.status}</td>
                          <td>{rec.punchedInAt}</td>
                          <td>{rec.punchedOutAt}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "salary" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Salary Management</h2>
            <p className="mb-3">
              Paid Today: {paidToday} | Yet to Pay: {unpaidToday}
            </p>
            <div className="h-62 overflow-y-auto scrollbar-thin dark:hover:scrollbar-thumb-cyan dark:scrollbar-thumb-card dark:scrollbar-track-card hover:scrollbar-thumb-background hover:scrollbar-track-cyan mb-4 shadow-inner border dark:border-cyan rounded-lg p-4">
              {employees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => openSalaryDialog(emp.employeeID)}
                  className="cursor-pointer border p-3 rounded-lg mb-2 hover:bg-muted/10 dark:hover:bg-muted/20"
                >
                  {emp.employeeID} - {emp.firstName} {emp.lastName}
                </div>
              ))}
            </div>
            {selectedSalary.length > 0 && (
              <div className="mt-6 p-4 border dark:border-cyan rounded-lg">
                <h3 className="font-semibold mb-3">
                  Salary Details for {selectedEmployee}
                </h3>
                <div className="h-62 overflow-y-auto scrollbar-thin dark:hover:scrollbar-thumb-cyan dark:scrollbar-thumb-card dark:scrollbar-track-card hover:scrollbar-thumb-background hover:scrollbar-track-cyan mb-4">
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr>
                        <th className="p-2 border dark:border-muted">Month</th>
                        <th className="p-2 border dark:border-muted">Basic</th>
                        <th className="p-2 border dark:border-muted">
                          Allowances
                        </th>
                        <th className="p-2 border dark:border-muted">
                          Deductions
                        </th>
                        <th className="p-2 border dark:border-muted">
                          Net Pay
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedSalary.map((s, i) => (
                        <tr key={i}>
                          <td className="p-2 border dark:border-muted">
                            {s.month}
                          </td>
                          <td className="p-2 border dark:border-muted">
                            {s.basicSalary}
                          </td>
                          <td className="p-2 border dark:border-muted">
                            {s.allowances}
                          </td>
                          <td className="p-2 border dark:border-muted">
                            {s.deductions}
                          </td>
                          <td className="p-2 border dark:border-muted">
                            {s.netPay}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {tab === "leaves" && (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Leave Requests</h2>
            <div className="h-62 overflow-y-auto scrollbar-thin dark:hover:scrollbar-thumb-cyan dark:scrollbar-thumb-card dark:scrollbar-track-card hover:scrollbar-thumb-background hover:scrollbar-track-cyan mb-4 shadow-inner border dark:border-cyan rounded-lg p-4">
              <table className="min-w-full text-xs p-4">
                <thead className="bg-muted/20 dark:bg-card">
                  <tr>
                    <th>ID</th>
                    <th>EmployeeID</th>
                    <th>Name</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((req) => (
                    <tr key={req.id} className="border-b dark:border-muted">
                      <td>{req.id}</td>
                      <td>{req.employeeID}</td>
                      <td>{req.fullName}</td>
                      <td>{req.startDate}</td>
                      <td>{req.endDate}</td>
                      <td>{req.type}</td>
                      <td>{req.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Employee Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      >
        <DialogPanel className="fixed inset-0 bg-black bg-opacity-30">
          <div className="flex items-center justify-center h-full dark:text-cyan">
            <div className="bg-white dark:bg-card rounded-lg p-6 w-full max-w-2xl">
              <DialogTitle className="text-xl font-bold mb-4">
                Edit Employee Information
              </DialogTitle>
              {editEmployeeData && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (editEmployeeId) {
                      editEmployee(editEmployeeId, editEmployeeData);
                    }
                  }}
                >
                  <div className="h-62 overflow-y-auto scrollbar-thin dark:hover:scrollbar-thumb-cyan dark:scrollbar-thumb-card dark:scrollbar-track-card hover:scrollbar-thumb-background hover:scrollbar-track-cyan mb-4">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block mb-1">First Name</label>
                        <input
                          type="text"
                          value={editEmployeeData.firstName}
                          onChange={(e) =>
                            setEditEmployeeData({
                              ...editEmployeeData,
                              firstName: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Last Name</label>
                        <input
                          type="text"
                          value={editEmployeeData.lastName}
                          onChange={(e) =>
                            setEditEmployeeData({
                              ...editEmployeeData,
                              lastName: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block mb-1">Gender</label>
                      <select
                        value={editEmployeeData.gender}
                        onChange={(e) =>
                          setEditEmployeeData({
                            ...editEmployeeData,
                            gender: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block mb-1">Blood Group</label>
                      <input
                        type="text"
                        value={editEmployeeData.bloodGroup}
                        onChange={(e) =>
                          setEditEmployeeData({
                            ...editEmployeeData,
                            bloodGroup: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block mb-1">Date of Birth</label>
                        <input
                          type="date"
                          value={editEmployeeData.dateOfBirth}
                          onChange={(e) =>
                            setEditEmployeeData({
                              ...editEmployeeData,
                              dateOfBirth: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Phone Number</label>
                        <input
                          type="tel"
                          value={editEmployeeData.phoneNo}
                          onChange={(e) =>
                            setEditEmployeeData({
                              ...editEmployeeData,
                              phoneNo: e.target.value,
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block mb-1">Email</label>
                      <input
                        type="email"
                        value={editEmployeeData.email}
                        onChange={(e) =>
                          setEditEmployeeData({
                            ...editEmployeeData,
                            email: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block mb-1">Education</label>
                      <input
                        type="text"
                        value={editEmployeeData.education}
                        onChange={(e) =>
                          setEditEmployeeData({
                            ...editEmployeeData,
                            education: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block mb-1">Qualification</label>
                      <input
                        type="text"
                        value={editEmployeeData.qualification}
                        onChange={(e) =>
                          setEditEmployeeData({
                            ...editEmployeeData,
                            qualification: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block mb-1">Designation</label>
                      <input
                        type="text"
                        value={editEmployeeData.designation}
                        onChange={(e) =>
                          setEditEmployeeData({
                            ...editEmployeeData,
                            designation: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded"
                      />
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4">
                      <div>
                        <label className="block mb-1">Attendance</label>
                        <input
                          type="number"
                          value={editEmployeeData.attendance}
                          onChange={(e) =>
                            setEditEmployeeData({
                              ...editEmployeeData,
                              attendance: parseInt(e.target.value),
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Salary</label>
                        <input
                          type="number"
                          value={editEmployeeData.salary}
                          onChange={(e) =>
                            setEditEmployeeData({
                              ...editEmployeeData,
                              salary: parseFloat(e.target.value),
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Rating</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editEmployeeData.rating}
                          onChange={(e) =>
                            setEditEmployeeData({
                              ...editEmployeeData,
                              rating: parseFloat(e.target.value),
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                      <div>
                        <label className="block mb-1">Paid Leaves Left</label>
                        <input
                          type="number"
                          value={editEmployeeData.paidLeavesLeft}
                          onChange={(e) =>
                            setEditEmployeeData({
                              ...editEmployeeData,
                              paidLeavesLeft: parseInt(e.target.value),
                            })
                          }
                          className="w-full p-2 border rounded"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditDialogOpen(false)}
                      className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </DialogPanel>
      </Dialog>

      {/* Approval Dialog */}
      {selectedSignup && (
        <Dialog
          open={isApproveDialogOpen}
          onClose={() => setIsApproveDialogOpen(false)}
        >
          <DialogPanel className="fixed inset-0 bg-black bg-opacity-30">
            <div className="flex items-center justify-center h-full dark:text-cyan">
              <div className="bg-white dark:bg-card rounded-lg p-6 w-full max-w-2xl">
                <DialogTitle className="text-xl font-bold mb-4">
                  Approve Signup
                </DialogTitle>
                <div className="mb-4">
                  <p className="font-bold">
                    {selectedSignup.firstName} {selectedSignup.lastName}
                  </p>
                  <p>Email: {selectedSignup.email}</p>
                  <p>Employee ID: {selectedSignup.employeeID}</p>
                </div>

                <div className="mb-4">
                  <label className="block mb-2">Approve as:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      id="admin"
                      name="role"
                      value="admin"
                      checked={selectedRole === "admin"}
                      onChange={() => setSelectedRole("admin")}
                    />
                    <label htmlFor="admin">Admin</label>

                    <input
                      type="radio"
                      id="employee"
                      name="role"
                      value="employee"
                      checked={selectedRole === "employee"}
                      onChange={() => setSelectedRole("employee")}
                    />
                    <label htmlFor="employee">Employee</label>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block mb-1">Attendance Information</label>
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Punched In</th>
                        <th>Punched Out</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border dark:border-muted">Date</td>
                        <td className="p-2 border dark:border-muted">
                          <select className="w-full p-2 border rounded">
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="halfday">Half Day</option>
                            <option value="remote">Remote</option>
                          </select>
                        </td>
                        <td className="p-2 border dark:border-muted">
                          <input
                            type="time"
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td className="p-2 border dark:border-muted">
                          <input
                            type="time"
                            className="w-full p-2 border rounded"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mb-4">
                  <label className="block mb-1">Salary Information</label>
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr>
                        <th>Month</th>
                        <th>Basic</th>
                        <th>Allowances</th>
                        <th>Deductions</th>
                        <th>Net Pay</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border dark:border-muted">
                          <input
                            type="month"
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td className="p-2 border dark:border-muted">
                          <input
                            type="number"
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td className="p-2 border dark:border-muted">
                          <input
                            type="number"
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td className="p-2 border dark:border-muted">
                          <input
                            type="number"
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td className="p-2 border dark:border-muted">
                          <input
                            type="number"
                            className="w-full p-2 border rounded"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mb-4">
                  <label className="block mb-1">Leave Information</label>
                  <table className="min-w-full text-xs">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border dark:border-muted">
                          <select className="w-full p-2 border rounded">
                            <option value="Sick">Sick</option>
                            <option value="Vacation">Vacation</option>
                            <option value="Maternity">Maternity</option>
                            <option value="Paternity">Paternity</option>
                            <option value="Unpaid">Unpaid</option>
                            <option value="Other">Other</option>
                          </select>
                        </td>
                        <td className="p-2 border dark:border-muted">
                          <input
                            type="date"
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td className="p-2 border dark:border-muted">
                          <input
                            type="date"
                            className="w-full p-2 border rounded"
                          />
                        </td>
                        <td className="p-2 border dark:border-muted">
                          <textarea
                            className="w-full p-2 border rounded"
                            rows={3}
                          ></textarea>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsApproveDialogOpen(false)}
                    className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => approveSignup(selectedSignup.id)}
                    className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      )}

      {/* Employee Details Dialog */}
      {showEmployeeDetails && selectedEmployee && (
        <Dialog
          open={showEmployeeDetails}
          onClose={() => setShowEmployeeDetails(false)}
        >
          <DialogPanel className="fixed inset-0 bg-black bg-opacity-30">
            <div className="flex items-center justify-center h-full dark:text-cyan">
              <div className="bg-white dark:bg-card rounded-lg p-6 w-full max-w-2xl">
                <DialogTitle className="text-xl font-bold mb-4">
                  Employee Details
                </DialogTitle>
                {employees.find((e) => e.employeeID === selectedEmployee) && (
                  <div className="h-62 overflow-y-auto scrollbar-thin dark:hover:scrollbar-thumb-cyan dark:scrollbar-thumb-card dark:scrollbar-track-card hover:scrollbar-thumb-background hover:scrollbar-track-cyan mb-4">
                    <table className="min-w-full text-sm">
                      <tbody>
                        <tr>
                          <td className="font-bold p-2">ID:</td>
                          <td className="p-2">
                            {
                              employees.find(
                                (e) => e.employeeID === selectedEmployee
                              )?.id
                            }
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold p-2">Employee ID:</td>
                          <td className="p-2">{selectedEmployee}</td>
                        </tr>
                        <tr>
                          <td className="font-bold p-2">Name:</td>
                          <td className="p-2">
                            {
                              employees.find(
                                (e) => e.employeeID === selectedEmployee
                              )?.firstName
                            }
                            {
                              employees.find(
                                (e) => e.employeeID === selectedEmployee
                              )?.lastName
                            }
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold p-2">Gender:</td>
                          <td className="p-2">
                            {
                              employees.find(
                                (e) => e.employeeID === selectedEmployee
                              )?.gender
                            }
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold p-2">Blood Group:</td>
                          <td className="p-2">
                            {
                              employees.find(
                                (e) => e.employeeID === selectedEmployee
                              )?.bloodGroup
                            }
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold p-2">Date of Birth:</td>
                          <td className="p-2">
                            {
                              employees.find(
                                (e) => e.employeeID === selectedEmployee
                              )?.dateOfBirth
                            }
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold p-2">Date of Joining:</td>
                          <td className="p-2">
                            {
                              employees.find(
                                (e) => e.employeeID === selectedEmployee
                              )?.dateOfJoining
                            }
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold p-2">Phone Number:</td>
                          <td className="p-2">
                            {
                              employees.find(
                                (e) => e.employeeID === selectedEmployee
                              )?.phoneNo
                            }
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold p-2">Email:</td>
                          <td className="p-2">
                            {
                              employees.find(
                                (e) => e.employeeID === selectedEmployee
                              )?.email
                            }
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold p-2">Education:</td>
                          <td className="p-2">
                            {
                              employees.find(
                                (e) => e.employeeID === selectedEmployee
                              )?.education
                            }
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold p-2">Qualification:</td>
                          <td className="p-2">
                            {
                              employees.find(
                                (e) => e.employeeID === selectedEmployee
                              )?.qualification
                            }
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold p-2">Designation:</td>
                          <td className="p-2">
                            {
                              employees.find(
                                (e) => e.employeeID === selectedEmployee
                              )?.designation
                            }
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold p-2">Attendance:</td>
                          <td className="p-2">
                            {
                              employees.find(
                                (e) => e.employeeID === selectedEmployee
                              )?.attendance
                            }
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold p-2">Salary:</td>
                          <td className="p-2">
                            {
                              employees.find(
                                (e) => e.employeeID === selectedEmployee
                              )?.salary
                            }
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold p-2">Rating:</td>
                          <td className="p-2">
                            {
                              employees.find(
                                (e) => e.employeeID === selectedEmployee
                              )?.rating
                            }
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold p-2">Paid Leaves Left:</td>
                          <td className="p-2">
                            {
                              employees.find(
                                (e) => e.employeeID === selectedEmployee
                              )?.paidLeavesLeft
                            }
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setShowEmployeeDetails(false)}
                    className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </DialogPanel>
        </Dialog>
      )}
    </div>
  );
}
