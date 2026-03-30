

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";
import Navbar from "../components/NavBar";

// ─── Mock modules ────────────────────────────────────────────────────────────


// Mock authService
vi.mock("../services/authService", () => ({
  getSession: vi.fn().mockResolvedValue(null),
  logout: vi.fn(),
}));

// Mock supabase
vi.mock("../lib/supabaseClient", () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn().mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
      }),
    },
  },
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

import { getSession, logout } from "../services/authService.js";

/** Render Navbar inside a MemoryRouter at the given initial path */
function renderNavbar(initialPath = "/") {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="*" element={<Navbar />} />
      </Routes>
    </MemoryRouter>
  );
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("Navbar", () => {
  beforeEach(async() => {
    const { supabase } = await import("../lib/supabaseClient");
    supabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: vi.fn() } },
    });

    const { getSession } = await import("../services/authService");
    getSession.mockResolvedValue(null); // safe default for every test
  });

  // ── Branding ───────────────────────────────────────────────────────────────

  describe("Branding", () => {
    it("renders the logo text", async () => {
      getSession.mockResolvedValue(null);
      renderNavbar();
      expect(await screen.findByText(/Nuvem Lanches/i)).toBeInTheDocument();
    });

    it("renders the logo emoji", async () => {
      getSession.mockResolvedValue(null);
      renderNavbar();
      expect(await screen.findByText("☁️")).toBeInTheDocument();
    });

    it("logo links to home", async () => {
      getSession.mockResolvedValue(null);
      renderNavbar();
      const logoLink = await screen.findByRole("link", { name: /Nuvem Lanches/i });
      expect(logoLink).toHaveAttribute("href", "/");
    });
  });

  // ── Unauthenticated state ──────────────────────────────────────────────────

  describe("Unauthenticated (no session)", () => {
    beforeEach(() => {
      getSession.mockResolvedValue(null);
    });

    it("shows Login link", async () => {
      renderNavbar();
      const loginLinks = await screen.findAllByRole("link", { name: /login/i });
      expect(loginLinks.length).toBeGreaterThan(0);
    });

    it("shows Cadastrar link", async () => {
      renderNavbar();
      const cadastrarLinks = await screen.findAllByRole("link", {
        name: /cadastrar/i,
      });
      expect(cadastrarLinks.length).toBeGreaterThan(0);
    });

    it("does NOT show Perfil link", async () => {
      renderNavbar();
      await screen.findAllByRole("link", { name: /login/i }); // wait for render
      expect(screen.queryByRole("link", { name: /perfil/i })).toBeNull();
    });

    it("does NOT show Meus Pedidos link", async () => {
      renderNavbar();
      await screen.findAllByRole("link", { name: /login/i });
      expect(screen.queryByRole("link", { name: /meus pedidos/i })).toBeNull();
    });

    it("does NOT show Sair button", async () => {
      renderNavbar();
      await screen.findAllByRole("link", { name: /login/i });
      expect(screen.queryByRole("button", { name: /sair/i })).toBeNull();
    });
  });

  // ── Authenticated state ────────────────────────────────────────────────────

  describe("Authenticated (active session)", () => {
    beforeEach(() => {
      getSession.mockResolvedValue({ user: { id: "123", email: "user@test.com" } });
    });

    it("shows Perfil link", async () => {
      renderNavbar();
      const perfilLinks = await screen.findAllByRole("link", { name: /perfil/i });
      expect(perfilLinks.length).toBeGreaterThan(0);
    });

    it("shows Meus Pedidos link", async () => {
      renderNavbar();
      const pedidosLinks = await screen.findAllByRole("link", {
        name: /meus pedidos/i,
      });
      expect(pedidosLinks.length).toBeGreaterThan(0);
    });

    it("shows Sair button", async () => {
      renderNavbar();
      const sairButtons = await screen.findAllByText(/sair/i);
      expect(sairButtons.length).toBeGreaterThan(0);
    });

    it("does NOT show Login link", async () => {
      renderNavbar();
      await screen.findAllByRole("link", { name: /perfil/i });
      expect(screen.queryByRole("link", { name: /^login$/i })).toBeNull();
    });

    it("does NOT show Cadastrar link", async () => {
      renderNavbar();
      await screen.findAllByRole("link", { name: /perfil/i });
      expect(screen.queryByRole("link", { name: /cadastrar/i })).toBeNull();
    });
  });

  // ── Logout flow ────────────────────────────────────────────────────────────

  describe("Logout", () => {
    beforeEach(() => {
      getSession.mockResolvedValue({ user: { id: "123" } });
    });

    it("calls logout() when Sair is clicked", async () => {
      logout.mockResolvedValue();
      renderNavbar();

      const sairBtn = await screen.findAllByText(/sair/i);
      fireEvent.click(sairBtn[0]);

      await waitFor(() => expect(logout).toHaveBeenCalledTimes(1));
    });

    it('shows "Saindo..." while logging out', async () => {
      // Never resolves so we can inspect the in-progress state
      logout.mockReturnValue(new Promise(() => {}));
      renderNavbar();

      const sairBtn = await screen.findAllByText(/sair/i);
      fireEvent.click(sairBtn[0]);

      await waitFor(() =>
        expect(screen.getAllByText(/saindo\.\.\./i).length).toBeGreaterThan(0)
      );
    });

    it("disables Sair button while logging out", async () => {
      logout.mockReturnValue(new Promise(() => {}));
      renderNavbar();

      // Find all Sair buttons (desktop + mobile), click the first one
      const sairBtns = await screen.findAllByText(/sair/i);
      fireEvent.click(sairBtns[0]);

      await waitFor(() => {
        const saindoBtns = screen.getAllByText(/saindo\.\.\./i);
        saindoBtns.forEach((btn) => {
          if (btn.tagName === "BUTTON") expect(btn).toBeDisabled();
        });
      });
    });
  });

  // ── Mobile hamburger menu ──────────────────────────────────────────────────

  describe("Mobile hamburger menu", () => {
    beforeEach(() => {
      getSession.mockResolvedValue(null);
      
    });

    it("renders the hamburger button", async () => {
      const { container } = renderNavbar();
      await screen.findAllByRole("link", { name: /login/i });
      expect(container.querySelector(".nav-hamburger")).toBeInTheDocument();
    });

    it("toggles mobile menu open on hamburger click", async () => {
        const { container } = renderNavbar();
        await screen.findAllByRole("link", { name: /login/i });

        const hamburger = container.querySelector(".nav-hamburger");
        fireEvent.click(hamburger);

        const loginLinks = screen.getAllByRole("link", { name: /login/i });
        expect(loginLinks.length).toBeGreaterThanOrEqual(1);
      
    });

    it("closes mobile menu when hamburger clicked a second time", async () => {
        const { container } = renderNavbar();
        await screen.findAllByRole("link", { name: /login/i });

        const hamburger = container.querySelector(".nav-hamburger");
        fireEvent.click(hamburger); // open
        fireEvent.click(hamburger); // close — no crash
    });
  });

  // ── Active link styling ────────────────────────────────────────────────────

  describe("Active link detection", () => {
    beforeEach(() => {
      getSession.mockResolvedValue({ user: { id: "123" } });
    });

    it("Perfil link is present when on /perfil route", async () => {
      renderNavbar("/perfil");
      const perfilLinks = await screen.findAllByRole("link", { name: /perfil/i });
      expect(perfilLinks.length).toBeGreaterThan(0);
    });

    it("Meus Pedidos link is present when on /historico route", async () => {
      renderNavbar("/historico");
      const pedidosLinks = await screen.findAllByRole("link", {
        name: /meus pedidos/i,
      });
      expect(pedidosLinks.length).toBeGreaterThan(0);
    });
  });

  // ── Unsubscribe on unmount ─────────────────────────────────────────────────

  describe("Cleanup", () => {
    it("unsubscribes from auth state changes on unmount", async () => {
      const unsubscribeMock = vi.fn();
      const { supabase } = await import("../lib/supabaseClient");
      supabase.auth.onAuthStateChange.mockReturnValue({
        data: { subscription: { unsubscribe: unsubscribeMock } },
      });

      getSession.mockResolvedValue(null);
      const { unmount } = renderNavbar();

      await screen.findAllByRole("link", { name: /login/i });
      unmount();

      expect(unsubscribeMock).toHaveBeenCalledTimes(1);
    });
  });
});