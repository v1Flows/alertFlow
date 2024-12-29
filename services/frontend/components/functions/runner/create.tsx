"use client";

import type { UseDisclosureReturn } from "@nextui-org/use-disclosure";

import {
  Button,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Snippet,
  useDisclosure,
} from "@nextui-org/react";
import { LibraryIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import AddRunner from "@/lib/fetch/runner/POST/AddRunner";
import CreateRunnerToken from "@/lib/fetch/project/POST/CreateRunnerToken";
import { CheckIcon } from "@/components/icons";
import ErrorCard from "@/components/error/ErrorCard";

export default function CreateRunnerModal({
  disclosure,
  project,
  alertflow_runner,
}: {
  disclosure: UseDisclosureReturn;
  project: any;
  alertflow_runner: any;
}) {
  const router = useRouter();
  const { isOpen, onOpenChange } = disclosure;

  // instructions modal
  const { isOpen: isOpenInstructions, onOpenChange: onOpenChangeInstructions } =
    useDisclosure();
  const [inApikey, setInApikey] = React.useState("");
  const [inRunnerId, setInRunnerId] = React.useState("");

  const [name, setName] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [errorText, setErrorText] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  async function createRunner() {
    setIsLoading(true);

    const response = (await AddRunner({
      projectId: project.id ? project.id : "none",
      name,
      alertflow_runner,
    })) as any;

    if (!response) {
      setIsLoading(false);
      setError(true);
      setErrorText("Failed to create runner");
      setErrorMessage("An error occurred while creating the runner");
      toast.error("Failed to create runner");

      return;
    }

    const tokenResponse = (await CreateRunnerToken({
      projectId: project.id ? project.id : "none",
      description: `${name} Runner Token`,
    })) as any;

    if (!tokenResponse) {
      setIsLoading(false);
      setError(true);
      setErrorText("Failed to create runner token");
      setErrorMessage("An error occurred while creating the runner token");
      router.refresh();
      toast.error("Failed to create runner token");
    }

    if (response.success && tokenResponse.success) {
      setName("");
      onOpenChange();
      setError(false);
      setErrorText("");
      setErrorMessage("");

      // set variables
      setInApikey(tokenResponse.data.key);
      setInRunnerId(response.data.runner.id);
      onOpenChangeInstructions();
      router.refresh();
      toast.success("Runner created successfully");
    } else {
      setError(true);
      setErrorText(response.error.error);
      setErrorMessage(response.error.message);
      toast.error(`Failed to create runner: ${response.error.error}`);
    }

    setIsLoading(false);
  }

  return (
    <>
      <Modal isOpen={isOpen} placement="center" onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-wrap items-center">
                <div className="flex flex-col gap-2">
                  <p className="text-lg font-bold">Add Runner</p>
                  <p className="text-sm text-default-500">
                    Add a new runner to your project.
                  </p>
                </div>
              </ModalHeader>
              <ModalBody>
                {error && (
                  <ErrorCard error={errorText} message={errorMessage} />
                )}
                <Input
                  label="Name"
                  labelPlacement="outside"
                  placeholder="Enter the runner name"
                  value={name}
                  variant="flat"
                  onValueChange={setName}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="ghost" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={isLoading}
                  onPress={createRunner}
                >
                  Add
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        isOpen={isOpenInstructions}
        placement="center"
        onOpenChange={onOpenChangeInstructions}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-wrap items-center justify-center gap-2 text-success">
                <CheckIcon />
                Runner Created
              </ModalHeader>
              <ModalBody>
                <p>Use the below information to configure your new runner.</p>
                <Divider />
                <div>
                  <p className="text-sm font-bold text-default-400">
                    Runner ID
                  </p>
                  <Snippet hideSymbol className="w-full">
                    {inRunnerId}
                  </Snippet>
                </div>
                <div>
                  <p className="text-sm font-bold text-default-400">Token</p>
                  <Snippet hideSymbol className="w-full" codeString={inApikey}>
                    <span>{`${inApikey.slice(0, 30)}...`}</span>
                  </Snippet>
                  <p className="text-sm text-default-400">
                    The Token can always be found on the &quot;Tokens&quot; tab.
                  </p>
                </div>
                <p className="mt-2 text-sm text-default-500">
                  If you need help with the configuration, please click the
                  documentation button below.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  startContent={<LibraryIcon />}
                  variant="bordered"
                  onPress={onClose}
                >
                  Show Documentation
                </Button>
                <Button
                  color="success"
                  startContent={<CheckIcon />}
                  onPress={onClose}
                >
                  <span className="font-bold">Understood</span>
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
