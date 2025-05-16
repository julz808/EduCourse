
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Target, FileQuestion, BarChart3, TestTube } from "lucide-react";

export const Navigation = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <nav className={`h-screen bg-white border-r border-r-edu-teal/10 transition-all duration-300 ${
      isCollapsed ? "w-20" : "w-64"
    }`}>
      <div className="p-4 flex items-center justify-between border-b border-b-edu-teal/10">
        <div className={`flex items-center ${isCollapsed ? "justify-center w-full" : ""}`}>
          {isCollapsed ? (
            <span className="text-edu-teal text-2xl font-bold">E</span>
          ) : (
            <div className="flex items-center">
              <span className="text-edu-coral text-2xl font-bold">Edu</span>
              <span className="text-edu-teal text-2xl font-bold">Course</span>
            </div>
          )}
        </div>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`text-edu-navy/50 hover:text-edu-navy ${isCollapsed ? "hidden" : ""}`}
        >
          {isCollapsed ? "→" : "←"}
        </button>
      </div>

      <div className="p-4">
        <ul className="space-y-2">
          <li>
            <NavLink 
              to="/dashboard" 
              className={({ isActive }) => 
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <LayoutDashboard size={20} />
              {!isCollapsed && <span>Dashboard</span>}
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/dashboard/diagnostic" 
              className={({ isActive }) => 
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <TestTube size={20} />
              {!isCollapsed && <span>Diagnostic</span>}
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/dashboard/drill" 
              className={({ isActive }) => 
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <Target size={20} />
              {!isCollapsed && <span>Drill</span>}
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/dashboard/practice-tests" 
              className={({ isActive }) => 
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <FileQuestion size={20} />
              {!isCollapsed && <span>Practice Tests</span>}
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/dashboard/insights" 
              className={({ isActive }) => 
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <BarChart3 size={20} />
              {!isCollapsed && <span>Insights</span>}
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navigation;
