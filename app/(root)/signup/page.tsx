import { SignupForm } from "@/components/signup-form"

export default function SignupPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-2 p-2 md:p-3">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs mt-3">
            <SignupForm />
          </div>
        </div>  
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="http://173.249.17.22:9000/faturize/foto.jpg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
