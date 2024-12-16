"use client";

import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  useDisclosure,
} from "@nextui-org/react";
import React from "react";

import ChangeUserPasswordModal from "../functions/users/changePassword";
import DeleteUserModal from "../functions/users/delete";
import DisableUserModal from "../functions/users/disable";

import CellWrapper from "./cell-wrapper";
import SwitchCell from "./switch-cell";

export default function SecuritySettings({ user }: { user: any }) {
  const updatePasswordModal = useDisclosure();
  const disableUserModal = useDisclosure();
  const deleteUserModal = useDisclosure();

  return (
    <>
      <Card className="w-full p-2">
        <CardHeader className="flex flex-col items-start px-4 pb-0 pt-4">
          <p className="text-large">Security Settings</p>
          <p className="text-small text-default-500">
            Manage your security preferences
          </p>
        </CardHeader>
        <CardBody className="space-y-2">
          {/* Email */}
          <CellWrapper>
            <div>
              <p>Email Address</p>
              <p className="text-small text-default-500">
                The email address associated with your account.
              </p>
            </div>
            <div className="flex w-full flex-wrap items-center justify-end gap-6 sm:w-auto sm:flex-nowrap">
              <div className="flex flex-col items-end">
                <p>{user.email}</p>
                <p className="text-small text-success">Verified</p>
              </div>
              <Button
                isDisabled
                endContent={<Icon icon="solar:pen-2-linear" />}
                radius="full"
                variant="bordered"
              >
                Edit
              </Button>
            </div>
          </CellWrapper>
          {/* Password */}
          <CellWrapper>
            <div>
              <p>Password</p>
              <p className="text-small text-default-500">
                Set a unique password to protect your account.
              </p>
            </div>
            <Button
              radius="full"
              variant="bordered"
              onPress={() => updatePasswordModal.onOpen}
            >
              Change
            </Button>
          </CellWrapper>
          {/* Two-Factor Authentication */}
          <SwitchCell
            isDisabled
            defaultSelected={false}
            description="Add an extra layer of security to your account."
            label="Two-Factor Authentication"
          />
          {/* Deactivate Account */}
          <CellWrapper>
            <div>
              <p>Deactivate Account</p>
              <p className="text-small text-default-500">
                Deactivate your account
              </p>
            </div>
            <Button
              radius="full"
              variant="bordered"
              onPress={() => disableUserModal.onOpen}
            >
              Deactivate
            </Button>
          </CellWrapper>
          {/* Delete Account */}
          <CellWrapper>
            <div>
              <p>Delete Account</p>
              <p className="text-small text-default-500">
                Delete your account and all your data.
              </p>
            </div>
            <Button
              color="danger"
              radius="full"
              variant="flat"
              onPress={() => deleteUserModal.onOpen}
            >
              Delete
            </Button>
          </CellWrapper>
        </CardBody>
      </Card>
      <ChangeUserPasswordModal
        disclosure={updatePasswordModal}
        userId={user.id}
      />
      <DisableUserModal disclosure={disableUserModal} user={user} />
      <DeleteUserModal disclosure={deleteUserModal} user={user} />
    </>
  );
}
