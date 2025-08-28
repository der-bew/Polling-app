// polling-app/app/auth/page.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-4xl font-bold mb-8">
          Welcome to the Polling App
        </h1>
        <div className="w-full max-w-sm">
          <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 dark:bg-gray-800">
            <div className="mb-4">
              <Label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300" htmlFor="email">
                Email
              </Label>
              <Input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
              />
            </div>
            <div className="mb-6">
              <Label className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300" htmlFor="password">
                Password
              </Label>
              <Input
                className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                placeholder="******************"
              />
              <p className="text-red-500 text-xs italic">Please choose a password.</p>
            </div>
            <div className="flex items-center justify-between">
              <Button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                Sign In
              </Button>
              <a
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                href="#"
              >
                Forgot Password?
              </a>
            </div>
          </form>
          <p className="text-gray-700 text-xs dark:text-gray-300">
            Don&apos;t have an account?{" "}
            <a
              className="text-blue-500 hover:text-blue-800 font-bold"
              href="#"
            >
              Sign Up
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
