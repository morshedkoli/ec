"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Don't apply admin layout to login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || session.user.role !== "admin") {
      router.push("/admin/login");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
          <p style={{ marginTop: '16px', color: '#64748b', fontSize: '16px' }}>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: "/admin/login" });
  };

  const isActiveRoute = (path: string) => pathname === path;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex'
    }}>
      {/* Sidebar */}
      <div style={{
        width: '280px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        left: isSidebarOpen ? '0' : '-280px',
        transition: 'left 0.3s ease-in-out',
        zIndex: 50,
        boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)'
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#3b82f6',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg style={{ width: '24px', height: '24px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#1e293b',
                margin: 0
              }}>
                Admin Panel
              </h1>
              <p style={{
                fontSize: '12px',
                color: '#64748b',
                margin: 0
              }}>
                Management System
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={{
          flex: 1,
          padding: '20px 0',
          overflowY: 'auto'
        }}>
          <div style={{ padding: '0 16px' }}>
            <p style={{
              fontSize: '12px',
              fontWeight: '600',
              color: '#64748b',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '12px',
              paddingLeft: '16px'
            }}>
              Main Navigation
            </p>
            
            <div style={{ marginBottom: '24px' }}>
              <Link
                href="/admin/dashboard"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  backgroundColor: isActiveRoute('/admin/dashboard') ? '#eff6ff' : 'transparent',
                  color: isActiveRoute('/admin/dashboard') ? '#1d4ed8' : '#475569',
                  border: isActiveRoute('/admin/dashboard') ? '1px solid #dbeafe' : '1px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <svg style={{
                  width: '20px',
                  height: '20px',
                  marginRight: '12px',
                  color: isActiveRoute('/admin/dashboard') ? '#1d4ed8' : '#64748b'
                }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                </svg>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Dashboard
                </span>
                {isActiveRoute('/admin/dashboard') && (
                  <div style={{
                    width: '4px',
                    height: '20px',
                    backgroundColor: '#1d4ed8',
                    borderRadius: '2px',
                    marginLeft: 'auto'
                  }}></div>
                )}
              </Link>
              
              <Link
                href="/admin/users"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  backgroundColor: isActiveRoute('/admin/users') ? '#eff6ff' : 'transparent',
                  color: isActiveRoute('/admin/users') ? '#1d4ed8' : '#475569',
                  border: isActiveRoute('/admin/users') ? '1px solid #dbeafe' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                  marginTop: '4px'
                }}
              >
                <svg style={{
                  width: '20px',
                  height: '20px',
                  marginRight: '12px',
                  color: isActiveRoute('/admin/users') ? '#1d4ed8' : '#64748b'
                }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Users
                </span>
                {isActiveRoute('/admin/users') && (
                  <div style={{
                    width: '4px',
                    height: '20px',
                    backgroundColor: '#1d4ed8',
                    borderRadius: '2px',
                    marginLeft: 'auto'
                  }}></div>
                )}
              </Link>
            </div>

            {/* Quick Actions */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{
                fontSize: '12px',
                fontWeight: '600',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '12px',
                paddingLeft: '16px'
              }}>
                Quick Actions
              </p>
              
              <Link
                href="/admin/users/add"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  backgroundColor: '#f0fdf4',
                  color: '#166534',
                  border: '1px solid #bbf7d0',
                  transition: 'all 0.2s ease'
                }}
              >
                <svg style={{
                  width: '20px',
                  height: '20px',
                  marginRight: '12px'
                }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  Add User
                </span>
              </Link>
            </div>
          </div>
        </nav>

        {/* User Profile Section */}
        <div style={{
          padding: '20px 16px',
          borderTop: '1px solid #e2e8f0',
          backgroundColor: '#f8fafc'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <span style={{
                fontSize: '18px',
                fontWeight: '600',
                color: 'white'
              }}>
                {session.user.name?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1e293b',
                margin: '0 0 4px 0'
              }}>
                {session.user.name || 'Admin User'}
              </p>
              <p style={{
                fontSize: '12px',
                color: '#64748b',
                margin: 0
              }}>
                {session.user.email}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleSignOut}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 16px',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fee2e2';
              e.currentTarget.style.borderColor = '#fca5a5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#fef2f2';
              e.currentTarget.style.borderColor = '#fecaca';
            }}
          >
            <svg style={{
              width: '18px',
              height: '18px',
              marginRight: '8px'
            }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: isSidebarOpen ? '280px' : '0',
        transition: 'margin-left 0.3s ease-in-out',
        width: '100%'
      }}>
        {/* Top Bar */}
        <div style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              style={{
                padding: '8px',
                backgroundColor: 'transparent',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <svg style={{ width: '20px', height: '20px', color: '#64748b' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h2 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b',
                margin: 0
              }}>
                {pathname === '/admin/dashboard' ? 'Dashboard' : 
                 pathname === '/admin/users' ? 'User Management' :
                 pathname === '/admin/profile' ? 'Profile' :
                 pathname === '/admin/profile/edit' ? 'Edit Profile' :
                 pathname.includes('/admin/users/add') ? 'Add New User' :
                 'Admin Panel'}
              </h2>
              <p style={{
                fontSize: '14px',
                color: '#64748b',
                margin: '4px 0 0 0'
              }}>
                Welcome back, {session?.user?.name || 'Admin'}
              </p>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              padding: '8px 16px',
              backgroundColor: '#f0f9ff',
              color: '#0369a1',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '500',
              border: '1px solid #bae6fd'
            }}>
              Admin
            </div>
            
            <Link
              href="/admin/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                textDecoration: 'none',
                color: '#475569',
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.borderColor = '#cbd5e1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white'
              }}>
                {session?.user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {session?.user?.name || 'Profile'}
              </span>
              <svg style={{
                width: '16px',
                height: '16px',
                color: '#64748b'
              }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Page Content */}
        <main style={{
          padding: '24px',
          minHeight: 'calc(100vh - 80px)'
        }}>
          {children}
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40
          }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
