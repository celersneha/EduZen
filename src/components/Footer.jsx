import Image from 'next/image';

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-50 to-blue-50 border-t border-gray-200/60 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="flex items-center">
            <Image
              src="/eduzen-logo.png"
              alt="EduZen Logo"
              width={100}
              height={33}
              className="h-8 w-auto opacity-80"
            />
          </div>
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} EduZen. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
