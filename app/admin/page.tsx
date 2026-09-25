"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  ArrowUpRight,
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Upload,
  Check,
  X,
  LogOut,
  Eye,
  EyeOff,
  RefreshCw,
  FolderGit2,
  Layers,
  Image as ImageIcon,
  Wrench,
  User,
  Save,
  RotateCcw,
} from "lucide-react";
import type { Project, SkillGroup, SkillItem, ProfileData } from "@/types/portfolio";
import { DEFAULT_PROFILE } from "@/constants/profile";
import { DEFAULT_SKILL_GROUPS, createUniqueSlug } from "@/constants/skills";

const CATEGORY_OPTIONS = [
  "Full Stack",
  "Frontend",
  "Networking",
  "Data Science",
  "AI / ML",
  "Mobile",
  "DevOps",
];

const ACCENT_PRESETS = [
  {
    name: "Cyan",
    accent: "from-cyan-500/10 via-teal-500/[0.03] to-white",
    glow: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
    color: "#087f75",
  },
  {
    name: "Violet",
    accent: "from-violet-500/10 via-purple-500/[0.03] to-white",
    glow: "hover:border-violet-500/50 hover:shadow-violet-500/10",
    color: "#7767d7",
  },
  {
    name: "Fuchsia",
    accent: "from-fuchsia-500/10 via-violet-500/[0.03] to-white",
    glow: "hover:border-fuchsia-500/50 hover:shadow-fuchsia-500/10",
    color: "#d946ef",
  },
  {
    name: "Emerald",
    accent: "from-emerald-500/10 via-teal-500/[0.03] to-white",
    glow: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
    color: "#10b981",
  },
  {
    name: "Amber",
    accent: "from-amber-500/10 via-orange-500/[0.03] to-white",
    glow: "hover:border-amber-500/50 hover:shadow-amber-500/10",
    color: "#f59e0b",
  },
  {
    name: "Rose",
    accent: "from-rose-500/10 via-red-500/[0.03] to-white",
    glow: "hover:border-rose-500/50 hover:shadow-rose-500/10",
    color: "#f43f5e",
  },
  {
    name: "Indigo",
    accent: "from-indigo-500/10 via-purple-500/[0.03] to-white",
    glow: "hover:border-indigo-500/50 hover:shadow-indigo-500/10",
    color: "#6366f1",
  },
];

type ActiveTab = "projects" | "skills" | "profile";

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState<ActiveTab>("projects");

  // Projects State
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  // Project Edit / Create Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "Full Stack",
    customCategory: "",
    type: "",
    description: "",
    tagsString: "",
    githubUrl: "",
    demoUrl: "",
    image: "",
    accent: ACCENT_PRESETS[0].accent,
    glow: ACCENT_PRESETS[0].glow,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Project Delete confirmation
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Skills State (Toolkit)
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>(DEFAULT_SKILL_GROUPS);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [savingSkills, setSavingSkills] = useState(false);
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [editingSkillInfo, setEditingSkillInfo] = useState<{
    groupId: string;
    skill: SkillItem | null;
  } | null>(null);
  const [skillForm, setSkillForm] = useState({ name: "", desc: "", targetGroupId: "" });

  // Group Modal (Add / Edit Group Title)
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<SkillGroup | null>(null);
  const [groupTitleInput, setGroupTitleInput] = useState("");

  // Profile & Hero State
  const [profileData, setProfileData] = useState<ProfileData>(DEFAULT_PROFILE);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileUploading, setProfileUploading] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileFileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch Projects
  const fetchProjects = useCallback(async () => {
    setLoadingProjects(true);
    try {
      const res = await fetch("/api/projects", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
      }
    } catch {
      showToast("Gagal memuat data project", "error");
    } finally {
      setLoadingProjects(false);
    }
  }, []);

  // Fetch Skills
  const fetchSkills = useCallback(async () => {
    setLoadingSkills(true);
    try {
      const res = await fetch("/api/admin/skills", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setSkillGroups(data);
      }
    } catch {
      showToast("Gagal memuat data toolkit", "error");
    } finally {
      setLoadingSkills(false);
    }
  }, []);

  // Fetch Profile
  const fetchProfile = useCallback(async () => {
    setLoadingProfile(true);
    try {
      const res = await fetch("/api/admin/profile", { cache: "no-store" });
      const data = await res.json();
      if (data && typeof data === "object") {
        setProfileData((prev) => ({ ...prev, ...data }));
      }
    } catch {
      showToast("Gagal memuat profil", "error");
    } finally {
      setLoadingProfile(false);
    }
  }, []);

  // Check auth on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/admin/check");
        const data = await res.json();
        setAuthed(Boolean(data.authenticated));
        if (data.authenticated) {
          fetchProjects();
          fetchSkills();
          fetchProfile();
        }
      } catch {
        setAuthed(false);
      }
    }
    checkAuth();
  }, [fetchProjects, fetchSkills, fetchProfile]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setLoginError(data.error || "Login gagal.");
        setLoginLoading(false);
        return;
      }

      setAuthed(true);
      setPassword("");
      fetchProjects();
      fetchSkills();
      fetchProfile();
      showToast("Selamat datang di Admin CMS!");
    } catch {
      setLoginError("Terjadi kesalahan jaringan.");
    } finally {
      setLoginLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setAuthed(false);
      showToast("Anda telah keluar.");
    } catch {
      setAuthed(false);
    }
  }

  // --- PROJECT MANAGEMENT HANDLERS ---
  function openCreateModal() {
    setEditingProject(null);
    setFormData({
      title: "",
      category: "Full Stack",
      customCategory: "",
      type: "Full Stack Web App",
      description: "",
      tagsString: "Laravel, Livewire, MySQL",
      githubUrl: "",
      demoUrl: "",
      image: "",
      accent: ACCENT_PRESETS[0].accent,
      glow: ACCENT_PRESETS[0].glow,
    });
    setModalOpen(true);
  }

  function openEditModal(project: Project) {
    setEditingProject(project);
    const isStandardCategory = CATEGORY_OPTIONS.includes(project.category);
    setFormData({
      title: project.title,
      category: isStandardCategory ? project.category : "Custom",
      customCategory: isStandardCategory ? "" : project.category,
      type: project.type,
      description: project.description,
      tagsString: project.tags.join(", "),
      githubUrl: project.githubUrl || "",
      demoUrl: project.demoUrl || "",
      image: project.image || "",
      accent: project.accent || ACCENT_PRESETS[0].accent,
      glow: project.glow || ACCENT_PRESETS[0].glow,
    });
    setModalOpen(true);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Upload gagal", "error");
      } else {
        setFormData((prev) => ({ ...prev, image: data.url }));
        showToast("Gambar berhasil di-upload!");
      }
    } catch {
      showToast("Gagal mengunggah gambar", "error");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSaveProject(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      showToast("Judul dan deskripsi wajib diisi.", "error");
      return;
    }

    setSaving(true);
    const finalCategory =
      formData.category === "Custom"
        ? formData.customCategory.trim() || "General"
        : formData.category;

    const tags = formData.tagsString
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      id: editingProject?.id,
      title: formData.title.trim(),
      category: finalCategory,
      type: formData.type.trim() || "Web App",
      description: formData.description.trim(),
      tags,
      githubUrl: formData.githubUrl.trim() || undefined,
      demoUrl: formData.demoUrl.trim() || undefined,
      image: formData.image.trim() || undefined,
      accent: formData.accent,
      glow: formData.glow,
    };

    try {
      const isEdit = Boolean(editingProject);
      const res = await fetch("/api/admin/projects", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Gagal menyimpan project", "error");
      } else {
        showToast(
          isEdit ? "Project berhasil diperbarui!" : "Project baru berhasil ditambahkan!"
        );
        setModalOpen(false);
        fetchProjects();
      }
    } catch {
      showToast("Terjadi kesalahan saat menyimpan", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!projectToDelete) return;
    setDeleting(true);

    try {
      const res = await fetch(
        `/api/admin/projects?id=${encodeURIComponent(projectToDelete.id)}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Gagal menghapus project", "error");
      } else {
        showToast("Project berhasil dihapus!");
        setDeleteModalOpen(false);
        setProjectToDelete(null);
        fetchProjects();
      }
    } catch {
      showToast("Terjadi kesalahan saat menghapus", "error");
    } finally {
      setDeleting(false);
    }
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setProjects(updated);

    try {
      const orderedIds = updated.map((p) => p.id);
      await fetch("/api/admin/projects", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds }),
      });
      showToast("Urutan berhasil diperbarui!");
    } catch {
      showToast("Gagal menyimpan urutan baru", "error");
      fetchProjects();
    }
  }

  // --- SKILLS (TOOLKIT) HANDLERS ---
  async function saveSkillsDirectly(groupsToSave: SkillGroup[], successMsg: string) {
    setSavingSkills(true);
    try {
      const res = await fetch("/api/admin/skills", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groups: groupsToSave }),
      });
      if (res.ok) {
        showToast(successMsg);
      } else {
        showToast("Gagal menyimpan perubahan ke server", "error");
      }
    } catch {
      showToast("Terjadi kesalahan jaringan", "error");
    } finally {
      setSavingSkills(false);
    }
  }

  function openAddSkill(groupId: string) {
    setEditingSkillInfo({ groupId, skill: null });
    setSkillForm({ name: "", desc: "", targetGroupId: groupId });
    setSkillModalOpen(true);
  }

  function openEditSkill(groupId: string, skill: SkillItem) {
    setEditingSkillInfo({ groupId, skill });
    setSkillForm({ name: skill.name, desc: skill.desc, targetGroupId: groupId });
    setSkillModalOpen(true);
  }

  function handleSaveSkillModal(e: React.FormEvent) {
    e.preventDefault();
    if (!skillForm.name.trim() || !skillForm.desc.trim()) {
      showToast("Nama skill dan deskripsi wajib diisi.", "error");
      return;
    }

    const { targetGroupId, name, desc } = skillForm;
    const isEdit = Boolean(editingSkillInfo?.skill);

    const updatedGroups = skillGroups.map((group) => {
      // Remove from original group if moving across groups in edit
      if (
        isEdit &&
        editingSkillInfo &&
        editingSkillInfo.groupId !== targetGroupId &&
        group.id === editingSkillInfo.groupId
      ) {
        return {
          ...group,
          skills: group.skills.filter((s) => s.id !== editingSkillInfo.skill!.id),
        };
      }

      if (group.id === targetGroupId) {
        if (isEdit && editingSkillInfo?.skill) {
          // If within same group, replace
          if (editingSkillInfo.groupId === targetGroupId) {
            return {
              ...group,
              skills: group.skills.map((s) =>
                s.id === editingSkillInfo.skill!.id
                  ? { ...s, name: name.trim(), desc: desc.trim() }
                  : s
              ),
            };
          } else {
            // Moved to new group, add to it
            return {
              ...group,
              skills: [
                ...group.skills,
                { id: editingSkillInfo.skill.id, name: name.trim(), desc: desc.trim() },
              ],
            };
          }
        } else {
          // Add new
          const newId = createUniqueSlug(name, group.skills.length + 1);
          return {
            ...group,
            skills: [...group.skills, { id: newId, name: name.trim(), desc: desc.trim() }],
          };
        }
      }
      return group;
    });

    setSkillGroups(updatedGroups);
    setSkillModalOpen(false);
    saveSkillsDirectly(updatedGroups, isEdit ? "Skill berhasil diedit!" : "Skill baru ditambahkan!");
  }

  function handleDeleteSkill(groupId: string, skillId: string) {
    const updated = skillGroups.map((g) => {
      if (g.id === groupId) {
        return {
          ...g,
          skills: g.skills.filter((s) => s.id !== skillId),
        };
      }
      return g;
    });
    setSkillGroups(updated);
    saveSkillsDirectly(updated, "Skill dihapus.");
  }

  function handleMoveSkill(groupId: string, skillIndex: number, direction: "up" | "down") {
    const targetGroup = skillGroups.find((g) => g.id === groupId);
    if (!targetGroup) return;

    const targetIndex = direction === "up" ? skillIndex - 1 : skillIndex + 1;
    if (targetIndex < 0 || targetIndex >= targetGroup.skills.length) return;

    const newSkills = [...targetGroup.skills];
    const temp = newSkills[skillIndex];
    newSkills[skillIndex] = newSkills[targetIndex];
    newSkills[targetIndex] = temp;

    const updated = skillGroups.map((g) => (g.id === groupId ? { ...g, skills: newSkills } : g));
    setSkillGroups(updated);
    saveSkillsDirectly(updated, "Urutan skill disimpan.");
  }

  function openCreateGroupModal() {
    setEditingGroup(null);
    setGroupTitleInput("");
    setGroupModalOpen(true);
  }

  function openEditGroupModal(group: SkillGroup) {
    setEditingGroup(group);
    setGroupTitleInput(group.title);
    setGroupModalOpen(true);
  }

  function handleSaveGroupModal(e: React.FormEvent) {
    e.preventDefault();
    if (!groupTitleInput.trim()) {
      showToast("Judul grup wajib diisi.", "error");
      return;
    }

    let updated: SkillGroup[];
    if (editingGroup) {
      updated = skillGroups.map((g) =>
        g.id === editingGroup.id ? { ...g, title: groupTitleInput.trim() } : g
      );
    } else {
      const newId = createUniqueSlug(groupTitleInput, skillGroups.length + 1);
      updated = [
        ...skillGroups,
        {
          id: newId,
          title: groupTitleInput.trim(),
          skills: [],
        },
      ];
    }

    setSkillGroups(updated);
    setGroupModalOpen(false);
    saveSkillsDirectly(updated, editingGroup ? "Judul grup diperbarui!" : "Grup baru ditambahkan!");
  }

  function handleDeleteGroup(groupId: string) {
    const group = skillGroups.find((g) => g.id === groupId);
    if (!group) return;
    if (group.skills.length > 0) {
      if (
        !confirm(
          `Grup "${group.title}" memiliki ${group.skills.length} skills. Yakin ingin menghapus seluruh grup ini?`
        )
      ) {
        return;
      }
    }
    const updated = skillGroups.filter((g) => g.id !== groupId);
    setSkillGroups(updated);
    saveSkillsDirectly(updated, "Grup berhasil dihapus.");
  }

  // --- PROFILE & FOTO HANDLERS ---
  async function handleProfilePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setProfileUploading(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Upload foto profil gagal", "error");
      } else {
        setProfileData((prev) => ({ ...prev, avatarUrl: data.url }));
        showToast("Foto profil baru berhasil di-upload!");
      }
    } catch {
      showToast("Gagal mengunggah foto profil", "error");
    } finally {
      setProfileUploading(false);
      if (profileFileInputRef.current) profileFileInputRef.current.value = "";
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Gagal menyimpan profil", "error");
      } else {
        showToast("Foto profil & data berhasil disimpan!");
      }
    } catch {
      showToast("Terjadi kesalahan saat menyimpan profil", "error");
    } finally {
      setSavingProfile(false);
    }
  }

  const allCategories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];
  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  const totalSkillsCount = skillGroups.reduce((acc, g) => acc + g.skills.length, 0);

  // Initial loading state
  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#f4f6f8]">
        <div className="flex items-center gap-3 text-slate-500 font-mono text-sm">
          <RefreshCw className="w-5 h-5 animate-spin text-[#087f75]" />
          <span>Memeriksa sesi admin...</span>
        </div>
      </div>
    );
  }

  // Login Gate
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5 bg-gradient-to-br from-[#f8faf9] via-[#edf3f1] to-[#f4f0f9]">
        <div className="w-full max-w-md p-8 sm:p-10 rounded-[28px] border border-white/80 bg-white/70 backdrop-blur-2xl shadow-2xl shadow-slate-300/40">
          <div className="text-center space-y-3 mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-[#087f75] shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Admin Portfolio
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Masukkan password admin untuk mengelola portofolio.
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="password-input"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Password Admin
              </label>
              <div className="relative">
                <input
                  id="password-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ketik password admin..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/90 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#087f75]/30 focus:border-[#087f75] transition pr-11"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading || !password}
              className="w-full py-3 px-4 rounded-xl bg-[#087f75] hover:bg-[#076b63] disabled:opacity-50 text-white text-xs font-semibold tracking-wide transition shadow-lg shadow-teal-700/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowUpRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200/60 text-center">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-[#087f75] transition font-mono inline-flex items-center gap-1.5"
            >
              &larr; Kembali ke Halaman Portofolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8faf9] via-[#edf3f1] to-[#f4f0f9] pb-24">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/80 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-[#087f75]">
              <Layers size={18} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-slate-900">
                  Portfolio CMS
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-100 text-[#087f75] font-semibold">
                  Admin Active
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                {activeTab === "projects"
                  ? "data/projects.json"
                  : activeTab === "skills"
                  ? "data/skills.json"
                  : "data/profile.json"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white/80 hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-sm"
            >
              <span>Lihat Portofolio</span>
              <ExternalLink size={14} />
            </Link>

            {activeTab === "projects" && (
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#087f75] hover:bg-[#076b63] text-white text-xs font-semibold transition shadow-md shadow-teal-700/20 cursor-pointer"
              >
                <Plus size={16} />
                <span>Tambah Project</span>
              </button>
            )}

            {activeTab === "skills" && (
              <button
                onClick={openCreateGroupModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#087f75] hover:bg-[#076b63] text-white text-xs font-semibold transition shadow-md shadow-teal-700/20 cursor-pointer"
              >
                <Plus size={16} />
                <span>Tambah Kategori</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-transparent hover:border-rose-200 transition"
              title="Logout Admin"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* CMS Tabs Bar */}
        <div className="max-w-6xl mx-auto px-5 sm:px-8 border-t border-slate-200/50 flex items-center gap-2 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === "projects"
                ? "bg-[#087f75] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <FolderGit2 size={15} />
            <span>Proyek Portofolio</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === "projects"
                  ? "bg-white/20 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("skills")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === "skills"
                ? "bg-[#087f75] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <Wrench size={15} />
            <span>My Toolkit (Skills)</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeTab === "skills"
                  ? "bg-white/20 text-white"
                  : "bg-slate-200 text-slate-700"
              }`}
            >
              {totalSkillsCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeTab === "profile"
                ? "bg-[#087f75] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <User size={15} />
            <span>Foto Profil & Bio</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-5 sm:px-8 pt-8 space-y-6">
        {/* ======================================================== */}
        {/* TAB 1: PROJECTS MANAGEMENT                               */}
        {/* ======================================================== */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            {/* Banner Overview */}
            <div className="p-6 sm:p-8 rounded-[24px] border border-white/80 bg-white/60 backdrop-blur-xl shadow-lg shadow-slate-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-1">
                <p className="text-[11px] font-mono tracking-wider text-[#087f75] font-semibold uppercase">
                  Dashboard / Projects Management
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Kelola Proyek Portofolio
                </h2>
                <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                  Setiap perubahan disimpan ke{" "}
                  <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[11px]">
                    data/projects.json
                  </code>{" "}
                  dan langsung tampil di halaman utama portofolio.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={fetchProjects}
                  disabled={loadingProjects}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingProjects ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Filter Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white/80 text-slate-600 hover:bg-white border border-slate-200/60"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Projects List */}
            {filteredProjects.length === 0 ? (
              <div className="p-12 text-center rounded-[24px] border border-slate-200 bg-white/70 backdrop-blur-md space-y-3">
                <p className="text-sm font-semibold text-slate-700">Tidak ada proyek dalam kategori ini.</p>
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#087f75] text-white text-xs font-semibold"
                >
                  <Plus size={15} /> Tambah Project Sekarang
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredProjects.map((project, index) => (
                  <div
                    key={project.id || project.title}
                    className="p-5 sm:p-6 rounded-[22px] border border-white/90 bg-white/75 backdrop-blur-xl shadow-md hover:shadow-xl hover:border-white transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-5 group"
                  >
                    {/* Left: Thumbnail & Details */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="relative w-24 h-24 sm:w-28 sm:h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shrink-0 flex items-center justify-center">
                        {project.image ? (
                          <Image
                            src={project.image}
                            alt={project.title}
                            fill
                            sizes="120px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-400 gap-1">
                            <ImageIcon size={22} />
                            <span className="text-[9px] font-mono">No Image</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                            {project.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {project.type}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 tracking-tight truncate">
                          {project.title}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-2 max-w-2xl leading-relaxed">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {project.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100/90 text-slate-600 font-mono"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 self-end md:self-center shrink-0 border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-end">
                      {/* Reorder Buttons */}
                      <div className="flex items-center border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
                        <button
                          onClick={() => handleMove(index, "up")}
                          disabled={index === 0 || activeCategory !== "All"}
                          className="p-2 hover:bg-slate-50 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                          title={
                            activeCategory !== "All"
                              ? "Pilih kategori 'All' untuk mengatur urutan"
                              : "Pindahkan ke atas"
                          }
                          aria-label="Pindahkan ke atas"
                        >
                          <ArrowUp size={15} />
                        </button>
                        <div className="w-[1px] h-5 bg-slate-200" />
                        <button
                          onClick={() => handleMove(index, "down")}
                          disabled={
                            index === projects.length - 1 || activeCategory !== "All"
                          }
                          className="p-2 hover:bg-slate-50 text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                          title={
                            activeCategory !== "All"
                              ? "Pilih kategori 'All' untuk mengatur urutan"
                              : "Pindahkan ke bawah"
                          }
                          aria-label="Pindahkan ke bawah"
                        >
                          <ArrowDown size={15} />
                        </button>
                      </div>

                      {/* Edit Button */}
                      <button
                        onClick={() => openEditModal(project)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-teal-50 hover:border-teal-200 text-slate-700 hover:text-[#087f75] text-xs font-medium transition shadow-sm cursor-pointer"
                      >
                        <Pencil size={14} />
                        <span>Edit</span>
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          setProjectToDelete(project);
                          setDeleteModalOpen(true);
                        }}
                        className="p-2 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-transparent hover:border-rose-200 transition cursor-pointer"
                        title="Hapus Proyek"
                        aria-label="Hapus Proyek"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: MY TOOLKIT / SKILLS MANAGEMENT                    */}
        {/* ======================================================== */}
        {activeTab === "skills" && (
          <div className="space-y-6">
            {/* Banner Overview */}
            <div className="p-6 sm:p-8 rounded-[24px] border border-white/80 bg-white/60 backdrop-blur-xl shadow-lg shadow-slate-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-1">
                <p className="text-[11px] font-mono tracking-wider text-[#087f75] font-semibold uppercase">
                  04 / MY TOOLKIT CMS
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  The tools behind <em>the ideas.</em>
                </h2>
                <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                  Kelola kategori kolom dan daftar keahlian/tools yang tampil di bagian toolkit portofolio.
                  Tersimpan di{" "}
                  <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[11px]">
                    data/skills.json
                  </code>.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={fetchSkills}
                  disabled={loadingSkills}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingSkills ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={openCreateGroupModal}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#087f75] text-white text-xs font-semibold transition shadow-md shadow-teal-700/20 cursor-pointer"
                >
                  <Plus size={15} />
                  <span>Tambah Kategori Kolom</span>
                </button>
              </div>
            </div>

            {/* Skill Groups Grid (Matching 3-column layout) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skillGroups.map((group, groupIndex) => (
                <div
                  key={group.id || group.title}
                  className="p-6 rounded-[24px] border border-white/90 bg-white/70 backdrop-blur-xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Header Group */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/70">
                      <div>
                        <span className="text-[11px] font-mono font-semibold text-[#087f75]">
                          0{groupIndex + 1}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                          {group.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditGroupModal(group)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
                          title="Ganti Nama Kategori"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteGroup(group.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Hapus Kategori Ini"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Skill Items List */}
                    <div className="divide-y divide-slate-100 my-2">
                      {group.skills.length === 0 ? (
                        <p className="text-xs text-slate-400 py-6 text-center italic">
                          Belum ada skill di kategori ini.
                        </p>
                      ) : (
                        group.skills.map((skill, skillIndex) => (
                          <div
                            key={skill.id || skill.name}
                            className="py-3 flex items-center justify-between gap-3 group/item hover:bg-slate-50/60 -mx-2 px-2 rounded-lg transition"
                          >
                            <div className="min-w-0 flex-1">
                              <strong className="block text-xs font-semibold text-slate-900 truncate">
                                {skill.name}
                              </strong>
                              <span className="block text-[11px] text-slate-500 truncate">
                                {skill.desc}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover/item:opacity-100 transition">
                              <button
                                onClick={() => handleMoveSkill(group.id, skillIndex, "up")}
                                disabled={skillIndex === 0}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                                title="Naikkan"
                              >
                                <ArrowUp size={12} />
                              </button>
                              <button
                                onClick={() => handleMoveSkill(group.id, skillIndex, "down")}
                                disabled={skillIndex === group.skills.length - 1}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                                title="Turunkan"
                              >
                                <ArrowDown size={12} />
                              </button>
                              <button
                                onClick={() => openEditSkill(group.id, skill)}
                                className="p-1 text-slate-400 hover:text-[#087f75]"
                                title="Edit Skill"
                              >
                                <Pencil size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteSkill(group.id, skill.id)}
                                className="p-1 text-slate-400 hover:text-rose-600"
                                title="Hapus Skill"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Add Skill inside Group Button */}
                  <button
                    onClick={() => openAddSkill(group.id)}
                    className="w-full mt-4 py-2 px-3 rounded-xl border border-dashed border-teal-300 hover:border-teal-500 bg-teal-50/50 hover:bg-teal-50 text-[#087f75] text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Tambah Skill ke {group.title}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: FOTO PROFIL & HERO BIO                            */}
        {/* ======================================================== */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            {/* Banner Overview */}
            <div className="p-6 sm:p-8 rounded-[24px] border border-white/80 bg-white/60 backdrop-blur-xl shadow-lg shadow-slate-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-1">
                <p className="text-[11px] font-mono tracking-wider text-[#087f75] font-semibold uppercase">
                  Profile & Hero CMS
                </p>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Ganti Foto Profil & Hero Section
                </h2>
                <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
                  Perbarui foto profil portrait utama, caption foto, serta data kontak personal Anda.
                  Tersimpan di{" "}
                  <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[11px]">
                    data/profile.json
                  </code>.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={fetchProfile}
                  disabled={loadingProfile}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium transition cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loadingProfile ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Profile Grid: Left Live Preview, Right Form Editor */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Live Portrait Preview */}
              <div className="lg:col-span-5 p-6 rounded-[28px] border border-white/90 bg-white/70 backdrop-blur-xl shadow-lg space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Live Preview Portrait
                  </h3>
                  <p className="text-xs text-slate-500">
                    Tampilan foto profil persis seperti yang muncul pada bagian atas portofolio Anda.
                  </p>
                </div>

                {/* Hero Portrait Component Replica */}
                <div className="relative pt-4 pb-2 px-2 max-w-[340px] mx-auto">
                  <div className="portrait-wrap">
                    <div className="portrait-frame">
                      <Image
                        src={profileData.avatarUrl || "/profile.jpg"}
                        alt={profileData.name}
                        fill
                        sizes="340px"
                        className="portrait"
                      />
                      <div className="portrait-caption">
                        <span style={{ whiteSpace: "pre-line" }}>
                          {profileData.caption || "A curious mind.\nA builder at heart."}
                        </span>
                        <ArrowUpRight size={24} />
                      </div>
                    </div>
                    <span className="portrait-note">{profileData.note || "CODE. CREATE. KEEP LEARNING."}</span>
                    <div className="portrait-stamp" aria-hidden="true">
                      ✳
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>URL Foto Saat Ini:</span>
                  <span className="truncate max-w-[180px] text-[#087f75]">
                    {profileData.avatarUrl || "/profile.jpg"}
                  </span>
                </div>
              </div>

              {/* Right Column: Upload & Fields Form */}
              <div className="lg:col-span-7 p-6 sm:p-8 rounded-[28px] border border-white/90 bg-white/75 backdrop-blur-xl shadow-lg">
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Photo Upload Section */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      1. Ganti Foto Profil
                    </label>

                    <div className="p-5 rounded-2xl border-2 border-dashed border-teal-200/90 bg-teal-50/30 flex flex-col sm:flex-row items-center gap-4">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 bg-white shrink-0 shadow-sm">
                        <Image
                          src={profileData.avatarUrl || "/profile.jpg"}
                          alt="Thumbnail Preview"
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>

                      <div className="space-y-2 flex-1 text-center sm:text-left">
                        <div>
                          <p className="text-xs font-semibold text-slate-800">
                            Upload Foto Baru
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Dukungan PNG, JPG, JPEG, atau WEBP (Maksimal 10 MB).
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                          <input
                            ref={profileFileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePhotoUpload}
                            className="hidden"
                            id="profile-photo-upload"
                          />
                          <button
                            type="button"
                            onClick={() => profileFileInputRef.current?.click()}
                            disabled={profileUploading}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#087f75] hover:bg-[#076b63] text-white text-xs font-semibold transition cursor-pointer shadow-sm disabled:opacity-50"
                          >
                            {profileUploading ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Mengunggah...</span>
                              </>
                            ) : (
                              <>
                                <Upload size={14} />
                                <span>Pilih File Foto</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setProfileData((prev) => ({ ...prev, avatarUrl: "/profile.jpg" }))
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-medium transition cursor-pointer"
                            title="Kembalikan ke foto bawaan /profile.jpg"
                          >
                            <RotateCcw size={12} />
                            <span>Reset Bawaan</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 font-mono">atau URL:</span>
                      <input
                        type="text"
                        value={profileData.avatarUrl}
                        onChange={(e) =>
                          setProfileData((prev) => ({ ...prev, avatarUrl: e.target.value }))
                        }
                        placeholder="/profile.jpg atau https://..."
                        className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-[#087f75]"
                      />
                    </div>
                  </div>

                  {/* Caption & Note Section */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      2. Caption & Catatan Portrait
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Caption Foto (Overlay Glass)
                        </label>
                        <textarea
                          rows={2}
                          value={profileData.caption}
                          onChange={(e) =>
                            setProfileData((prev) => ({ ...prev, caption: e.target.value }))
                          }
                          placeholder="A curious mind.&#10;A builder at heart."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#087f75] leading-relaxed"
                        />
                        <span className="text-[10px] text-slate-400">
                          Gunakan Enter untuk baris baru.
                        </span>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Catatan Bawah (Note Badge)
                        </label>
                        <input
                          type="text"
                          value={profileData.note}
                          onChange={(e) =>
                            setProfileData((prev) => ({ ...prev, note: e.target.value }))
                          }
                          placeholder="CODE. CREATE. KEEP LEARNING."
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#087f75]"
                        />
                        <span className="text-[10px] text-slate-400">
                          Teks kecil di bawah frame foto.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Personal Bio & Details */}
                  <div className="space-y-4 pt-4 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      3. Informasi Hero & Kontak
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Nama Lengkap
                        </label>
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData((prev) => ({ ...prev, name: e.target.value }))
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#087f75]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Lokasi
                        </label>
                        <input
                          type="text"
                          value={profileData.location}
                          onChange={(e) =>
                            setProfileData((prev) => ({ ...prev, location: e.target.value }))
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#087f75]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Universitas / Institusi
                        </label>
                        <input
                          type="text"
                          value={profileData.university}
                          onChange={(e) =>
                            setProfileData((prev) => ({ ...prev, university: e.target.value }))
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#087f75]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData((prev) => ({ ...prev, email: e.target.value }))
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#087f75]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          URL GitHub
                        </label>
                        <input
                          type="text"
                          value={profileData.github}
                          onChange={(e) =>
                            setProfileData((prev) => ({ ...prev, github: e.target.value }))
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#087f75]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          URL LinkedIn
                        </label>
                        <input
                          type="text"
                          value={profileData.linkedin}
                          onChange={(e) =>
                            setProfileData((prev) => ({ ...prev, linkedin: e.target.value }))
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#087f75]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Link CV
                        </label>
                        <input
                          type="text"
                          value={profileData.cvUrl}
                          onChange={(e) =>
                            setProfileData((prev) => ({ ...prev, cvUrl: e.target.value }))
                          }
                          placeholder="/cv-rashad-shaquille-taofik.pdf"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#087f75]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#087f75] hover:bg-[#076b63] disabled:opacity-50 text-white text-xs font-semibold transition shadow-lg shadow-teal-700/20 cursor-pointer"
                    >
                      {savingProfile ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Menyimpan Profil...</span>
                        </>
                      ) : (
                        <>
                          <Save size={15} />
                          <span>Simpan Foto & Data Profil</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* MODAL: CREATE / EDIT PROJECT                             */}
      {/* ======================================================== */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl my-8 rounded-[28px] border border-white/90 bg-white/95 backdrop-blur-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingProject ? "Edit Proyek Portofolio" : "Tambah Proyek Baru"}
                </h3>
                <p className="text-xs text-slate-500">
                  Isi informasi proyek yang akan ditampilkan pada portofolio Anda.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="p-6 space-y-4">
              {/* Title & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Judul Proyek *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Contoh: Prince E-Commerce"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#087f75]/30 focus:border-[#087f75]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tipe / Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="Contoh: Full Stack Web App"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#087f75]/30 focus:border-[#087f75]"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#087f75]/30 focus:border-[#087f75]"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                    <option value="Custom">+ Kategori Custom...</option>
                  </select>
                </div>

                {formData.category === "Custom" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Kategori Custom *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customCategory}
                      onChange={(e) =>
                        setFormData({ ...formData, customCategory: e.target.value })
                      }
                      placeholder="Ketik kategori baru..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#087f75]/30 focus:border-[#087f75]"
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi Proyek *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Jelaskan mengenai fitur, arsitektur, atau dampak dari proyek ini..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#087f75]/30 focus:border-[#087f75] leading-relaxed"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teknologi / Tags (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={formData.tagsString}
                  onChange={(e) =>
                    setFormData({ ...formData, tagsString: e.target.value })
                  }
                  placeholder="Next.js, TypeScript, Tailwind CSS, PostgreSQL"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#087f75]/30 focus:border-[#087f75]"
                />
              </div>

              {/* GitHub & Demo Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Link GitHub Repository
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, githubUrl: e.target.value })
                    }
                    placeholder="https://github.com/rasatshq/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#087f75]/30 focus:border-[#087f75]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Link Live Demo
                  </label>
                  <input
                    type="url"
                    value={formData.demoUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, demoUrl: e.target.value })
                    }
                    placeholder="https://my-demo-app.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#087f75]/30 focus:border-[#087f75]"
                  />
                </div>
              </div>

              {/* Screenshot Image Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-700">
                  Screenshot / Gambar Proyek
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/project-name.png atau upload file"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#087f75]/30 focus:border-[#087f75]"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="project-image-upload"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {uploading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload size={14} />
                        <span>Upload File</span>
                      </>
                    )}
                  </button>
                </div>

                {formData.image && (
                  <div className="relative w-32 h-20 rounded-xl overflow-hidden border border-slate-200 mt-2 bg-slate-50">
                    <Image
                      src={formData.image}
                      alt="Preview"
                      fill
                      sizes="140px"
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Accent Color Preset Swatches */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Warna Aksen Kartu
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {ACCENT_PRESETS.map((preset) => (
                    <button
                      type="button"
                      key={preset.name}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          accent: preset.accent,
                          glow: preset.glow,
                        })
                      }
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer ${
                        formData.accent === preset.accent
                          ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: preset.color }}
                      />
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#087f75] hover:bg-[#076b63] disabled:opacity-50 text-white text-xs font-semibold transition shadow-md shadow-teal-700/20 cursor-pointer"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>{editingProject ? "Simpan Perubahan" : "Tambah Project"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: DELETE PROJECT CONFIRMATION                       */}
      {/* ======================================================== */}
      {deleteModalOpen && projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-[28px] border border-white/90 bg-white/95 backdrop-blur-2xl shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
              <Trash2 size={20} />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                Hapus Proyek Ini?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Anda yakin ingin menghapus proyek{" "}
                <strong className="text-slate-800">
                  &ldquo;{projectToDelete.title}&rdquo;
                </strong>
                ? Tindakan ini akan menghapus data dari file{" "}
                <code className="px-1 rounded bg-slate-100 font-mono text-[10px]">
                  data/projects.json
                </code>.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold transition shadow-md shadow-rose-700/20 cursor-pointer"
              >
                {deleting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>Ya, Hapus Proyek</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT SKILL (TOOLKIT)                        */}
      {/* ======================================================== */}
      {skillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-[28px] border border-white/90 bg-white/95 backdrop-blur-2xl shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingSkillInfo?.skill ? "Edit Skill" : "Tambah Skill Baru"}
              </h3>
              <button
                onClick={() => setSkillModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveSkillModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori Kolom
                </label>
                <select
                  value={skillForm.targetGroupId}
                  onChange={(e) =>
                    setSkillForm({ ...skillForm, targetGroupId: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#087f75]/30 focus:border-[#087f75]"
                >
                  {skillGroups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Skill / Tool *
                </label>
                <input
                  type="text"
                  required
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  placeholder="Contoh: Next.js / React, Docker, Python"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#087f75]/30 focus:border-[#087f75]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Deskripsi Singkat *
                </label>
                <input
                  type="text"
                  required
                  value={skillForm.desc}
                  onChange={(e) => setSkillForm({ ...skillForm, desc: e.target.value })}
                  placeholder="Contoh: Modern SSR, App Router & UI"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#087f75]/30 focus:border-[#087f75]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSkillModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingSkills}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#087f75] hover:bg-[#076b63] text-white text-xs font-semibold transition shadow-md shadow-teal-700/20 cursor-pointer disabled:opacity-50"
                >
                  <Check size={14} />
                  <span>Simpan Skill</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: ADD / EDIT SKILL GROUP TITLE                      */}
      {/* ======================================================== */}
      {groupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-[28px] border border-white/90 bg-white/95 backdrop-blur-2xl shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingGroup ? "Ubah Nama Kategori" : "Tambah Kategori Kolom Baru"}
              </h3>
              <button
                onClick={() => setGroupModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveGroupModal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Kategori / Judul Kolom *
                </label>
                <input
                  type="text"
                  required
                  value={groupTitleInput}
                  onChange={(e) => setGroupTitleInput(e.target.value)}
                  placeholder="Contoh: Mobile & IoT"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#087f75]/30 focus:border-[#087f75]"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setGroupModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#087f75] hover:bg-[#076b63] text-white text-xs font-semibold transition shadow-md shadow-teal-700/20 cursor-pointer"
                >
                  <Check size={14} />
                  <span>Simpan Kategori</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-xl flex items-center gap-2.5 text-xs font-medium animate-in slide-in-from-bottom-5 duration-200 ${
            toast.type === "success"
              ? "bg-slate-900/95 text-white border-white/20 shadow-slate-900/30"
              : "bg-rose-900/95 text-white border-rose-500/30 shadow-rose-900/30"
          }`}
        >
          {toast.type === "success" ? (
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          ) : (
            <span className="w-2 h-2 rounded-full bg-rose-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
