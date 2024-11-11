import SimpleDropdown from '@root/app/_components/ui/SimpleDropdown';
import { Checkbox, Label } from 'flowbite-react';

const FilterDropdown = () => {
    return (
        <div className="flex items-center space-x-4">
            <SimpleDropdown
                label={
                    <>
                        <i className="mr-1.5 mt-1 w-5 fa-solid fa-filter"></i>
                        Filter
                    </>
                }
            >
                <div className="p-3">
                    <h6 className="mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        By status
                    </h6>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Label className="flex w-full items-center rounded-md px-1.5 py-1 text-sm font-medium text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600">
                                <Checkbox
                                    id="in-progress"
                                    name="in-progress"
                                    className="mr-2"
                                />
                                In progress
                            </Label>
                        </li>
                        <li>
                            <Label className="flex w-full items-center rounded-md px-1.5 py-1 text-sm font-medium text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600">
                                <Checkbox
                                    id="in-review"
                                    name="in-review"
                                    className="mr-2"
                                />
                                In review
                            </Label>
                        </li>
                        <li>
                            <Label className="flex w-full items-center rounded-md px-1.5 py-1 text-sm font-medium text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600">
                                <Checkbox
                                    id="completed"
                                    name="completed"
                                    className="mr-2"
                                />
                                Completed
                            </Label>
                        </li>
                        <li>
                            <Label className="flex w-full items-center rounded-md px-1.5 py-1 text-sm font-medium text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600">
                                <Checkbox
                                    id="cancelled"
                                    name="cancelled"
                                    className="mr-2"
                                />
                                Cancelled
                            </Label>
                        </li>
                    </ul>
                    <h6 className="mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white">
                        By number of users
                    </h6>
                    <ul className="space-y-2 text-sm">
                        <li>
                            <Label className="flex w-full items-center rounded-md px-1.5 py-1 text-sm font-medium text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600">
                                <Checkbox
                                    id="people-1"
                                    name="people-1"
                                    className="mr-2"
                                />
                                5-10 people
                            </Label>
                        </li>
                        <li>
                            <Label className="flex w-full items-center rounded-md px-1.5 py-1 text-sm font-medium text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600">
                                <Checkbox
                                    id="people-2"
                                    name="people-2"
                                    className="mr-2"
                                />
                                10+ people
                            </Label>
                        </li>
                        <li>
                            <Label className="flex w-full items-center rounded-md px-1.5 py-1 text-sm font-medium text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600">
                                <Checkbox
                                    id="people-3"
                                    name="people-3"
                                    className="mr-2"
                                />
                                More than 10 people
                            </Label>
                        </li>
                    </ul>
                    <a
                        href="#"
                        className="ml-1.5 mt-4 flex items-center text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                        Apply to all projects
                    </a>
                </div>
            </SimpleDropdown>
        </div>
    )
};

export default FilterDropdown;