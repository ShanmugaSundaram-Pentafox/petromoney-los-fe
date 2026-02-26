/* eslint-disable quotes */
import React, { useRef, useState, useEffect } from "react";
import {
  Container,
  Title,
  SimpleGrid,
  Card,
  Text,
  Group,
  ThemeIcon,
  Stack,
  Badge,
  Button,
  ActionIcon,
  Loader,
  Image,
} from "@mantine/core";
import {
  IconFileText,
  IconClock,
  IconUpload,
  IconCheck,
  IconEye,
} from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getDocumentChecklist, getUploadedDocuments, uploadDocument } from "../../../services/customerOnboarding.service";
import FormDialog from "../../../components/CommonComponents/FormDialog/FormDialog";
import { displayNotification } from "../../../components/CommonComponents/Notification/displayNotification";
import styled from 'styled-components';

/* -------------------- Allowed Types -------------------- */
const allowedTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
];

/* -------------------- Document Row -------------------- */

const PreviewWrapper = styled.div`
  width:100%;
  .image {
    width: 100%;
    object-fit: contain;
  }
  .iframe-container {
    height:72vh;
    overflow: hidden;
    padding-top: 45%;
    position: relative;
  }
  .iframe-container iframe {
    width:100%;
    height:100%;
    left: 0;
    position: absolute;
    top: 0;
  }
`;

const DocumentCard = ({
  document,
  dealershipId,
  applicantId,
  uploadedDocs,
}) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [imageModal, setImageModal] = useState({ open: false });

  // 🔥 Find uploaded document
  const uploadedDocument = uploadedDocs?.find(
    (item) => Number(item.doc_id) === Number(document.id)
  );

  const isUploaded = !!uploadedDocument;

  const { mutate, isLoading } = useMutation(uploadDocument, {
    onSuccess: () => {
      queryClient.invalidateQueries(["uploaded-documents", dealershipId]);
      displayNotification({
        message: "Document uploaded successfully",
        variant: "success",
      });
    },
    onError: (err) => {
      displayNotification({
        message: err || "Something went wrong",
        variant: "error",
      });
    },
  });

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      alert("Only images & PDF allowed.");
      return;
    }

    mutate({
      dealershipId,
      docId: document.id,
      applicantId,
      file,
    });
  };

  const handlePreview = () => {
    const url = uploadedDocument?.file_url;
    const fileUrl = uploadedDocument?.presigned_url;

    if (!fileUrl) return;

    const isPdf = url.toLowerCase().endsWith(".pdf");

    if (isPdf) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
      return;
    }

    // 🔥 If Image → open modal
    setImageModal({
      open: true,
      image: fileUrl,
    });
  };

  return (
    <>
      <Card shadow="sm" radius="md" padding="lg" withBorder>
        <Group justify="space-between" align="center">
          <Group>
            <ThemeIcon variant="light" size="lg" color="blue">
              <IconFileText size={18} />
            </ThemeIcon>

            <Stack gap={2}>
              <Text fw={600}>{document.description}</Text>
            </Stack>
          </Group>

          <Group>
            {/* Status Badge */}
            {isUploaded ? (
              <Badge
                variant="light"
                color="green"
                leftSection={<IconCheck size={14} />}
              >
                Uploaded
              </Badge>
            ) : (
              <Badge
                variant="light"
                color="gray"
                leftSection={<IconClock size={14} />}
              >
                Pending
              </Badge>
            )}

            {/* 👁 Preview Button */}
            {isUploaded && (
              <ActionIcon
                color="green"
                variant="light"
                onClick={handlePreview}
              >
                <IconEye size={16} />
              </ActionIcon>
            )}

            {/* Upload */}
            <Button
              variant="light"
              size="sm"
              leftSection={<IconUpload size={16} />}
              onClick={handleUploadClick}
              loading={isLoading}
            >
              Upload
            </Button>

            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={handleFileChange}
            />
          </Group>
        </Group>
      </Card>

      <FormDialog
        title={document.description}
        onDownload={null}
        open={imageModal.open}
        onClose={() => setImageModal({ open: false })}
      >
        <PreviewWrapper>
          <Image
            src={imageModal.image}
            h={'auto'}
            maw={500}
            fallbackSrc={'https://placehold.co/600x400?text=Not%20%20Found!'}
          />
        </PreviewWrapper>
      </FormDialog>
    </>
  );
};
/* -------------------- Main -------------------- */

const Documents = () => {
  const [documents, setDocuments] = useState([]);

  const dealershipId = 30; // static for now
  const applicantId = 35; // static for now

  const { data, isLoading: documentChecklistLoading } = useQuery(
    ["document-checklist"],
    getDocumentChecklist,
    {
      cacheTime: 0,
      onError: (err) => {
        displayNotification({
          message: err || "Something went wrong",
          variant: "error",
        });
      },
    }
  );

  const { data: uploadedDocsData, isLoading: uploadedDocsLoading } = useQuery(
    ["uploaded-documents", dealershipId],
    () => getUploadedDocuments(dealershipId),
    {
      enabled: !!data,
      cacheTime: 0,
      onError: (err) => {
        displayNotification({
          message: err || "Something went wrong",
          variant: "error",
        });
      }
    }
  );

  useEffect(() => {
    if (data) {
      setDocuments(data?.data?.documents || []);
    }
  }, [data]);

  const uploadedDocs = uploadedDocsData?.documents || [];

  const totalDocuments = documents.length;

  const uploadedCount = documents.filter((doc) =>
    uploadedDocs.some(
      (item) => Number(item.doc_id) === Number(doc.id)
    )
  ).length;

  const pendingCount = totalDocuments - uploadedCount;

  const stats = [
    { label: "Total", value: totalDocuments, color: "dark" },
    { label: "Uploaded", value: uploadedCount, color: "green" },
    { label: "Pending", value: pendingCount, color: "gray" },
  ];

  return (
    <Container size="xl" py="lg">
      {documentChecklistLoading || uploadedDocsLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "70vh",
          }}
        >
          <Loader size="lg" />
        </div>
      ) : (
        <>
          <Group mb="lg">
            <ThemeIcon size="lg" variant="light" color="blue">
              <IconFileText size={20} />
            </ThemeIcon>
            <Title order={3}>Documents</Title>
          </Group>

          <SimpleGrid cols={{
            base: 1,
            sm: 2,
            md: stats.length >= 3 ? 3 : stats.length,
          }} spacing="lg" mb="xl">
            {stats.map((stat) => (
              <Card
                key={stat.label}
                shadow="sm"
                radius="md"
                padding="lg"
                withBorder
                style={{
                  backgroundColor: "#f8f9fa",
                  textAlign: "center",
                }}
              >
                <Text fz="lg" fw={700} c={stat.color} mb={4}>
                  {stat.value}
                </Text>
                <Text size="sm" c="dimmed">
                  {stat.label}
                </Text>
              </Card>
            ))}
          </SimpleGrid>

          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={doc}
              dealershipId={dealershipId}
              applicantId={applicantId}
              uploadedDocs={uploadedDocs}
            />
          ))}
        </>
      )}
    </Container>
  );
};

export default Documents;