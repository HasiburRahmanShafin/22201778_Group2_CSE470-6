const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center">
          <p className="text-sm text-gray-600">
            DURJOG – Natural Disaster Intelligence & Early Warning System
          </p>
          <p className="text-xs text-gray-500 mt-1">
            © {new Date().getFullYear()} DURJOG. Keeping Bangladesh safe.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;