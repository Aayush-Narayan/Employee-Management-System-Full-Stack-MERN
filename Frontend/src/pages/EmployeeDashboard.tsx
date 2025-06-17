// src/pages/EmployeeDashboard.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import DashboardNavigation from "../components/DashboardNavigation";
import { useNavigate } from "react-router-dom";

interface Profile {
  employeeID: string;
  firstName: string;
  lastName: string;
  email: string;
  designation: string;
  department: string;
  dateOfJoining: string;
}

interface AttendanceSummary {
  daysThisMonth: number;
  paidLeavesRemaining: number;
}

interface LeaveSummary {
  pending: number;
  approved: number;
  rejected: number;
}

interface PayrollInfo {
  basicSalary: number;
  allowances: number;
  deductions: number;
  netPay: number;
  payDate: string;
}

export default function EmployeeDashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [attendanceSummary, setAttendanceSummary] = useState<AttendanceSummary | null>(null);
  const [todayAttendance, setTodayAttendance] = useState<{ status: string } | null>(null);
  const [leaves, setLeaves] = useState<LeaveSummary | null>(null);
  const [payroll, setPayroll] = useState<PayrollInfo | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState({
    profile: true,
    attendance: true,
    leaves: true,
    payroll: true,
    todayAttendance: true,
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE_URL as string;

  const getAuthHeader = () => {
    const token = localStorage.getItem("accessToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const calculateWorkingDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    let count = 0;
    const current = new Date(start);
    
    while (current <= end) {
      const day = current.getDay();
      if (day !== 0 && day !== 6) count++;
      current.setDate(current.getDate() + 1);
    }
    return count;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Profile
        const profileRes = await axios.get<Profile>(`${API}/api/employee/profile`, { headers: getAuthHeader() });
        setProfile(profileRes.data);
      } catch (_err) {
        setError("Unable to load profile.");
        console.error("Error loading profile:", _err);
      } finally {
        setLoading(prev => ({ ...prev, profile: false }));
      }

      try {
        // Fetch Attendance Summary
        const attendanceRes = await axios.get<AttendanceSummary>(`${API}/api/employee/attendance/summary`, { headers: getAuthHeader() });
        setAttendanceSummary(attendanceRes.data);
      } catch (_err) {
        setError("Unable to load attendance.");
        console.error("Error loading attendance:", _err);
      } finally {
        setLoading(prev => ({ ...prev, attendance: false }));
      }

      try {
        // Fetch Leave Summary
        const leavesRes = await axios.get<LeaveSummary>(`${API}/api/employee/leaves/summary`, { headers: getAuthHeader() });
        setLeaves(leavesRes.data);
      } catch (_err) {
        setError("Unable to load leave information.");
        console.error("Error loading leave information:", _err);
      } finally {
        setLoading(prev => ({ ...prev, leaves: false }));
      }

      try {
        // Fetch Payroll Info
        const payrollRes = await axios.get<PayrollInfo>(`${API}/api/employee/payroll/latest`, { headers: getAuthHeader() });
        setPayroll(payrollRes.data);
      } catch (_err) {
        setError("Unable to load payroll information.");
        console.error("Error loading payroll information:", _err);
      } finally {
        setLoading(prev => ({ ...prev, payroll: false }));
      }

      try {
        // Fetch Today's Attendance
        const todayRes = await axios.get<{ status: string }>(`${API}/api/employee/attendance/today`, { headers: getAuthHeader() });
        setTodayAttendance(todayRes.data);
      } catch (_err) {
        console.error("Error fetching today's attendance status:", _err);
      } finally {
        setLoading(prev => ({ ...prev, todayAttendance: false }));
      }
    };

    fetchData();
  }, [API]);

  const markAttendance = async () => {
    try {
      await axios.post(`${API}/api/employee/attendance/mark`, {}, { headers: getAuthHeader() });
      setTodayAttendance({ status: 'present' });
      // Refetch attendance summary
      const updatedAttendance = await axios.get<AttendanceSummary>(`${API}/api/employee/attendance/summary`, { headers: getAuthHeader() });
      setAttendanceSummary(updatedAttendance.data);
    } catch (_err) {
      console.error("Error marking attendance:", _err);
      setError("Failed to mark attendance.");
    }
  };

  const submitLeaveRequest = async () => {
    try {
      await axios.post(
        `${API}/api/employee/leaves/request`,
        { startDate, endDate, reason, type: 'Vacation' },
        { headers: getAuthHeader() }
      );
      setIsOpen(false);
      setStartDate('');
      setEndDate('');
      setReason('');
      // Refetch leave summary
      const updatedLeaves = await axios.get<LeaveSummary>(`${API}/api/employee/leaves/summary`, { headers: getAuthHeader() });
      setLeaves(updatedLeaves.data);
    } catch (_err) {
      console.error("Error submitting leave request:", _err);
      setError("Failed to submit leave request.");
    }
  };

  if (loading.profile || loading.attendance || loading.leaves || loading.payroll || loading.todayAttendance) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <p className="text-cyan animate-pulse">Loading your dashboard…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-contain bg-center bg-no-repeat dark:bg-background/80 dark:text-cyan">
      <DashboardNavigation />

      <div className="flex-1 p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-cyan dark:text-cyan">
            Employee Dashboard
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {/* Personal Information */}
          <div className="bg-white/90 dark:bg-card/60 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-cyan dark:text-cyan">
              Personal Information
            </h2>
            <div className="mb-4 space-y-1">
              <p className="font-medium">
                Name: {profile?.firstName} {profile?.lastName}
              </p>
              <p>Employee ID: {profile?.employeeID}</p>
              <p>Email: {profile?.email}</p>
              <p>Designation: {profile?.designation}</p>
              <p>
                Joining Date:{" "}
                {new Date(profile!.dateOfJoining).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <button
              onClick={() => navigate("/employee/edit-profile")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit Profile
            </button>
          </div>

          {/* Attendance */}
          <div className="bg-white/90 dark:bg-card/60 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-cyan dark:text-cyan">
              Attendance - {new Date().toLocaleDateString()}
            </h2>
            <div className="mb-4 space-y-1">
              <p>This Month: {attendanceSummary?.daysThisMonth ?? 0} days</p>
              <p>
                Paid Leave Remaining: {attendanceSummary?.paidLeavesRemaining ?? 0}{" "}
                days
              </p>
              {todayAttendance?.status === 'present' ? (
                <p className="text-green-500 font-medium">Attendance already marked today</p>
              ) : null}
            </div>
            <button
              onClick={markAttendance}
              disabled={todayAttendance?.status === 'present'}
              className={`${
                todayAttendance?.status === 'present'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-500 hover:bg-green-700'
              } text-white font-bold py-2 px-4 rounded`}
            >
              {todayAttendance?.status === 'present'
                ? 'Already Marked Today'
                : 'Mark Attendance'}
            </button>
          </div>

          {/* Leave Requests */}
          <div className="bg-white/90 dark:bg-card/60 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-cyan dark:text-cyan">
              Leave Requests
            </h2>
            <div className="mb-4 space-y-1">
              <p>Pending Requests: {leaves?.pending ?? 0}</p>
              <p>Approved Requests: {leaves?.approved ?? 0}</p>
              <p>Rejected Requests: {leaves?.rejected ?? 0}</p>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Apply for Leave
            </button>
          </div>
        </div>

        {/* Payroll Information */}
        <div className="bg-white/90 dark:bg-card/60 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-cyan dark:text-cyan">
            Payroll Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="font-medium">
                Basic Salary: ${payroll?.basicSalary.toLocaleString()}
              </p>
              <p>Allowances: ${payroll?.allowances.toLocaleString()}</p>
              <p>Deductions: ${payroll?.deductions.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="font-medium">
                Net Salary: ${payroll?.netPay.toLocaleString()}
              </p>
              <p>Pay Date: {payroll?.payDate}</p>
            </div>
          </div>
        </div>

        {/* Leave Application Modal */}
        {isOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white/90 dark:bg-card/60 p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4 text-cyan dark:text-cyan">
                Apply for Leave
              </h2>
              <div className="mb-4">
                <div className="flex gap-4 items-center mb-4">
                  <div>
                    <label className="block mb-2">From</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div>
                    <label className="block mb-2">To</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block mb-2">Reason</label>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Enter reason for leave"
                  />
                </div>
                <p className="text-sm">
                  Working Days: {calculateWorkingDays()}
                </p>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={submitLeaveRequest}
                  disabled={!startDate || !endDate || !reason}
                  className={`${
                    !startDate || !endDate || !reason
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-700'
                  } text-white font-bold py-2 px-4 rounded`}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
