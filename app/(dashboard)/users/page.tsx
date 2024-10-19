/**
 * v0 by Vercel.
 * @see https://v0.dev/t/G38LK4bWDXA
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-aqua">
      <div className="border-b dark:border-gray-700">
        <div className="container px-4 py-4 sm:py-6 lg:py-8">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-gray-500 dark:text-gray-400">List of registered users</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="container flex flex-col gap-4 px-4 py-6 sm:gap-6">
          <div className="w-full space-y-4">
            <div className="w-full max-w-lg space-y-1">
              <Label htmlFor="search">Search</Label>
              <Input id="search" placeholder="Search by name or email" />
            </div>
          </div>
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Licence Number</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">Alice</TableCell>
                  <TableCell>alice@example.com</TableCell>
                  <TableCell>123-456-7890</TableCell>
                  <TableCell>License123</TableCell>
                  <TableCell>Company A</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline">Edit</Button>
                      <Button variant="outline">Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Bob</TableCell>
                  <TableCell>bob@example.com</TableCell>
                  <TableCell>234-567-8901</TableCell>
                  <TableCell>License456</TableCell>
                  <TableCell>Company B</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline">Edit</Button>
                      <Button variant="outline">Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Charlie</TableCell>
                  <TableCell>charlie@example.com</TableCell>
                  <TableCell>345-678-9012</TableCell>
                  <TableCell>License789</TableCell>
                  <TableCell>Company C</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline">Edit</Button>
                      <Button variant="outline">Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">David</TableCell>
                  <TableCell>david@example.com</TableCell>
                  <TableCell>456-789-0123</TableCell>
                  <TableCell>LicenseABC</TableCell>
                  <TableCell>Company D</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline">Edit</Button>
                      <Button variant="outline">Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Eve</TableCell>
                  <TableCell>eve@example.com</TableCell>
                  <TableCell>567-890-1234</TableCell>
                  <TableCell>LicenseDEF</TableCell>
                  <TableCell>Company E</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline">Edit</Button>
                      <Button variant="outline">Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Frank</TableCell>
                  <TableCell>frank@example.com</TableCell>
                  <TableCell>678-901-2345</TableCell>
                  <TableCell>LicenseGHI</TableCell>
                  <TableCell>Company F</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline">Edit</Button>
                      <Button variant="outline">Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Grace</TableCell>
                  <TableCell>grace@example.com</TableCell>
                  <TableCell>789-012-3456</TableCell>
                  <TableCell>LicenseJKL</TableCell>
                  <TableCell>Company G</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline">Edit</Button>
                      <Button variant="outline">Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Hank</TableCell>
                  <TableCell>hank@example.com</TableCell>
                  <TableCell>890-123-4567</TableCell>
                  <TableCell>LicenseMNO</TableCell>
                  <TableCell>Company H</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline">Edit</Button>
                      <Button variant="outline">Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Ivy</TableCell>
                  <TableCell>ivy@example.com</TableCell>
                  <TableCell>901-234-5678</TableCell>
                  <TableCell>LicensePQR</TableCell>
                  <TableCell>Company I</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline">Edit</Button>
                      <Button variant="outline">Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  )
}