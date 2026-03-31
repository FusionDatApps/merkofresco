export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="container-base py-4 text-sm text-gray-500 text-center">
        © {new Date().getFullYear()} MerKofresco — Plataforma en desarrollo
      </div>
    </footer>
  );
}