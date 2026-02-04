"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./siteHeader.module.css";
import { siteData } from "../../data/home";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://127.0.0.1:8000";
const AUTH_STORAGE_KEY = "auth_user";

const navItems = siteData.nav.links;
const headerCopy = siteData.header;
const authCopy = siteData.nav.auth;
const brandName = siteData.brand.name;

type AuthCache = {
  email?: string;
  role?: string;
  access?: string;
  refresh?: string;
  display_name?: string;
  full_name?: string;
  handle?: string;
};

type ProfileResponse = {
  full_name?: string;
  handle?: string;
};

function readAuthCache(): AuthCache | null {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthCache;
  } catch (error) {
    return null;
  }
}

async function refreshAccessToken(): Promise<string | null> {
  const cached = readAuthCache();
  if (!cached?.refresh) return null;

  try {
    const response = await fetch(`${API_BASE}/api/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: cached.refresh }),
    });

    const data = (await response.json().catch(() => ({}))) as { access?: string };
    if (!response.ok) return null;

    const nextAccess = typeof data.access === "string" ? data.access : "";
    if (!nextAccess) return null;

    const nextCache: AuthCache = {
      ...cached,
      access: nextAccess,
    };
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextCache));
    window.dispatchEvent(new Event("auth-change"));
    return nextAccess;
  } catch (error) {
    return null;
  }
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [userEmail, setUserEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [role, setRole] = useState("athlete");
  const [menuOpen, setMenuOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const loadAuth = () => {
    const cached = readAuthCache();
    if (!cached?.email) {
      setUserEmail("");
      setDisplayName("");
      setRole("athlete");
      return;
    }

    const cachedName = (cached.handle || cached.display_name || cached.full_name || "").trim();
    setUserEmail(cached.email || "");
    setRole(cached.role || "athlete");
    setDisplayName(cachedName);
  };

  useEffect(() => {
    loadAuth();
    setReady(true);
    const handleAuthChange = () => loadAuth();
    const handleStorage = (event: StorageEvent) => {
      if (event.key === AUTH_STORAGE_KEY) {
        loadAuth();
      }
    };
    window.addEventListener("auth-change", handleAuthChange as EventListener);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("auth-change", handleAuthChange as EventListener);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!userEmail || displayName) return;

    let ignore = false;

    const loadProfileName = async () => {
      const cached = readAuthCache();
      const access = cached?.access;
      if (!access) return;

      let response = await fetch(`${API_BASE}/api/auth/profile/`, {
        headers: { Authorization: `Bearer ${access}` },
      });

      if (response.status === 401) {
        const refreshed = await refreshAccessToken();
        if (!refreshed) return;
        response = await fetch(`${API_BASE}/api/auth/profile/`, {
          headers: { Authorization: `Bearer ${refreshed}` },
        });
      }

      const data = (await response.json().catch(() => ({}))) as ProfileResponse;
      if (!response.ok) return;

      const nextName = (data.handle || "").trim();
      if (!nextName || ignore) return;

      setDisplayName(nextName);
      const latest = readAuthCache();
      if (latest) {
        const nextCache: AuthCache = {
          ...latest,
          handle: nextName,
        };
        window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextCache));
        window.dispatchEvent(new Event("auth-change"));
      }
    };

    loadProfileName();

    return () => {
      ignore = true;
    };
  }, [userEmail, displayName]);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  const handleLogout = () => {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    setUserEmail("");
    setDisplayName("");
    setRole("athlete");
    setMenuOpen(false);
    window.dispatchEvent(new Event("auth-change"));
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isAuthed = Boolean(userEmail);
  const effectiveName = displayName || headerCopy.defaultName;
  const initial = effectiveName.charAt(0).toUpperCase() || "U";
  const roleLabel =
    role === "organizer" ? headerCopy.roleLabels.organizer : headerCopy.roleLabels.athlete;
  const menuItems = role === "organizer" ? headerCopy.menu.organizer : headerCopy.menu.athlete;

  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand} aria-label={`${brandName} accueil`}>
        <span className={styles.brandMark} />
        {brandName}
      </Link>
      <nav className={styles.nav} aria-label="Navigation principale">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
              aria-current={active ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className={styles.auth}>
        {!ready ? (
          <div className={styles.authPlaceholder} aria-hidden />
        ) : isAuthed ? (
          <>
            <button type="button" className={styles.logoutButton} onClick={handleLogout}>
              {authCopy.logout}
            </button>
            <div className={styles.avatarWrapper} ref={menuRef}>
              <button
                type="button"
                className={styles.avatarButton}
                onClick={() => setMenuOpen((open) => !open)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
              >
                <span className={styles.avatarCircle}>
                  <span className={styles.avatarInitial}>{initial}</span>
                  <span className={styles.statusDot} aria-hidden />
                </span>
                <span className={styles.avatarMeta}>
                  <span className={styles.avatarName}>{effectiveName}</span>
                  <span className={styles.avatarRole}>{roleLabel}</span>
                </span>
              </button>
              {menuOpen ? (
                <div className={styles.menuPanel} role="menu">
                  <div className={styles.menuHeader}>
                    <div className={styles.menuAvatar}>{initial}</div>
                    <div>
                      <div className={styles.menuName}>{effectiveName}</div>
                      <div className={styles.menuRole}>{roleLabel}</div>
                    </div>
                  </div>
                  <div className={styles.menuDivider} />
                  {menuItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={styles.menuItem}
                      onClick={() => setMenuOpen(false)}
                    >
                      <span className={styles.menuIcon} />
                      {item.label}
                      <span className={styles.menuArrow}>&gt;</span>
                    </Link>
                  ))}
                  <div className={styles.menuDivider} />
                  <button
                    type="button"
                    className={`${styles.menuItem} ${styles.menuItemDanger}`}
                    onClick={handleLogout}
                  >
                    <span className={styles.menuIcon} />
                    {authCopy.logout}
                  </button>
                  <div className={styles.menuFooter}>{headerCopy.menu.menuFooter}</div>
                </div>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <Link className={styles.linkButton} href="/login">
              {authCopy.login}
            </Link>
            <Link className={styles.primaryButton} href="/signup">
              {authCopy.signup}
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
