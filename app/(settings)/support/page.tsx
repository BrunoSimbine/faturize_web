/**
 * v0 by Vercel.
 * @see https://v0.dev/t/t8mQv0CG84d
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function Component() {
  return (
    <div className="grid gap-2 lg:gap-4">
      <div>
        <div className="container">
          <div className="space-y-4">
            <div className="border rounded-lg">
              <details className="border-b last:border-0">
                <summary className="flex items-center space-x-2 cursor-pointer py-4 px-4">
                  <span className="font-medium">How do I deploy my app to the web?</span>
                  <div className="w-4 h-4 ml-auto opacity-50" />
                </summary>
                <div className="p-4 bg-gray-100 dark:bg-gray-800">
                  <p>
                    To deploy your app to the web, sign in to your Vercel account, import your project, and push your
                    code to the associated Git repository. Your app will be automatically deployed with the default
                    configuration.
                  </p>
                </div>
              </details>
            </div>
            <div className="border rounded-lg">
              <details className="border-b last:border-0">
                <summary className="flex items-center space-x-2 cursor-pointer py-4 px-4">
                  <span className="font-medium">How do I add a custom domain to my project?</span>
                  <div className="w-4 h-4 ml-auto opacity-50" />
                </summary>
                <div className="p-4 bg-gray-100 dark:bg-gray-800">
                  <p>
                    You can add a custom domain to your project by accessing the Domains section in your project
                    settings on the Vercel platform. Add your domain, verify ownership, and configure the desired
                    settings such as SSL and redirects.
                  </p>
                </div>
              </details>
            </div>
            <div className="border rounded-lg">
              <details className="border-b last:border-0">
                <summary className="flex items-center space-x-2 cursor-pointer py-4 px-4">
                  <span className="font-medium">How do I set up environment variables for my app?</span>
                  <div className="w-4 h-4 ml-auto opacity-50" />
                </summary>
                <div className="p-4 bg-gray-100 dark:bg-gray-800">
                  <p>
                    You can set up environment variables for your app by defining them in your project settings on the
                    Vercel platform. These variables will be securely injected into your app at build time, allowing you
                    to manage sensitive configuration across different environments.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t py-5">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl xl:text-5xl">Still need help?</h2>
          <div className="space-y-2">
            <p className="text-gray-500 md:text-xl/relaxed dark:text-gray-400">
              Enter your question below and we'll get back to you as soon as possible.
            </p>
            <form className="grid gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" required placeholder="Enter the subject of your question" />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  required
                  placeholder="Enter your question or issue"
                  className="min-h-[150px] resize-none"
                />
              </div>
              <Button type="submit">Submit</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}