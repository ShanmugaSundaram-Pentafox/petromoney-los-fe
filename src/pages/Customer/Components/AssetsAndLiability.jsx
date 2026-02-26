/* eslint-disable quotes */
import React, { useState, useMemo, useEffect } from 'react';
import {
  Container,
  Paper,
  Title,
  Group,
  Text,
  SimpleGrid,
  Button,
  TextInput,
  Stack,
  Divider,
  ActionIcon,
  ThemeIcon,
  Select,
  Loader,
} from '@mantine/core';
import {
  IconWallet,
  IconPlus,
  IconTrash,
  IconTrendingDown,
  IconCheck,
  IconRefresh,
} from '@tabler/icons-react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import {
  createAsset,
  deleteAsset,
  getApplicantAssets,
  getAssets,
  getLiabilities,
} from '../../../services/customerOnboarding.service';
import { displayNotification } from '../../../components/CommonComponents/Notification/displayNotification';
import { Modal } from '../../../components/Mantine/Modal/Modal';
import CustomerOnboardStorage from '../../../store/CustomerOnboardStorage';

const formatToINR = (value) => {
  if (!value) return '';
  const number = value.toString().replace(/,/g, '');
  return Number(number).toLocaleString('en-IN');
};

const AssetsAndLiability = () => {
  const queryClient = useQueryClient();

  const onboardData = CustomerOnboardStorage.get();

  const dealershipId = onboardData?.dealership_id || 30;
  const applicantId = onboardData?.applicant?.applicant_id || 30;

  const [assets, setAssets] = useState([]);
  const [liabilities, setLiabilities] = useState([]);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedAssetToDelete, setSelectedAssetToDelete] = useState(null);
  const [selectedIndexToDelete, setSelectedIndexToDelete] = useState(null);

  const { data: assetsData, isLoading: assetsLoading, refetch: refetchAssets, isFetching: assetsFetching } = useQuery(
    ['assets'],
    getAssets,
    {
      onSuccess: () => { },
      onError: (e) => { 
        displayNotification({
          variant: 'error',
          message: e || 'Error fetching assets',
        });
      },
      cacheTime: 0,
    }
  );

  const { data: applicantAssetsData, isLoading: applicantAssetsLoading, refetch: refetchApplicantAssets, isFetching: applicantAssetsFetching } =
    useQuery(
      ['applicant-assets', dealershipId, applicantId],
      () => getApplicantAssets({ dealershipId, applicantId }),
      {
        enabled: !!assetsData, // only run if assetsData is available, as we need it to map asset types
        cacheTime: 0, // disable cache to always get fresh data after mutations
        onError: (e) => {
          displayNotification({
            variant: 'error',
            message: e || 'Error fetching applicant assets',
          });
        },
      }
    );

  const assetMaster = useMemo(() => {
    return assetsData?.data || [];
  }, [assetsData]);

  const { data: liabilitiesData, isLoading: liabilitiesLoading, refetch: refetchLiabilities, isFetching: liabilitiesFetching } = useQuery(
    ['liabilities', dealershipId, applicantId],
    () => getLiabilities({ dealershipId, applicantId }),
    {
      enabled: !!assetsData && !!applicantAssetsData,
      cacheTime: 0,
      onError: (e) => {
        displayNotification({
          variant: 'error',
          message: e || 'Error fetching liabilities',
        });
      },
    }
  );

  const accounts =
    liabilitiesData?.data?.cibil_details?.data?.credit_report?.[0]?.accounts ||
    [];

  const mappedLiabilities = accounts.map((account) => ({
    type: account?.accountType || '-',
    bankName: account?.memberShortName || '-',
    loanAmount: Number(account?.highCreditAmount || 0),
    outstanding: Number(account?.currentBalance || 0),
    emi: Number(account?.emiAmount || 0),
  }));

  useEffect(() => {
    if (accounts.length > 0) {
      setLiabilities(mappedLiabilities);
    }
  }, [liabilitiesData]);

  useEffect(() => {
    const apiAssets = applicantAssetsData?.data?.assets || [];

    if (assetMaster.length > 0) {
      const mappedAssets = apiAssets.map((asset) => {
        const matchedAsset = assetMaster.find(
          (item) => item.asset_id === asset.asset_id
        );

        return {
          id: asset.id,
          type: matchedAsset?.name || '',
          dynamicFields: asset.details || {},
          asset_value: asset.asset_value || '',
          market_value: asset.market_value || '',
          ownership: asset.ownership || '',
          isFromAPI: true,
        };
      });

      setAssets(mappedAssets); // ✅ always update
    }
  }, [applicantAssetsData, assetMaster]);

  const totalAssets = useMemo(
    () =>
      assets
        .filter((asset) => asset.isFromAPI)
        .reduce((acc, curr) => acc + Number(curr.market_value || 0), 0),
    [assets]
  );

  const totalLiabilities = useMemo(
    () =>
      liabilities.reduce((acc, curr) => acc + Number(curr.outstanding || 0), 0),
    [liabilities]
  );

  const netWorth = totalAssets - totalLiabilities;

  const addAsset = () => {
    setAssets((prev) => [
      ...prev,
      {
        type: '',
        dynamicFields: {},
        asset_value: '',
        market_value: '',
        ownership: '',
        isFromAPI: false,
        isEditing: true,
      },
    ]);
  };

  const handleDeleteAsset = (asset, index) => {
    if (asset.isFromAPI && asset.id) {
      removeAsset({
        dealershipId,
        applicantId,
        assetId: asset.id,
      });
    } else {
      setAssets((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const { mutate: removeAsset, isLoading: isDeleting } = useMutation(
    deleteAsset,
    {
      onSuccess: (res) => {
        queryClient.invalidateQueries([
          'applicant-assets',
          dealershipId,
          applicantId,
        ]);

        displayNotification({
          variant: 'success',
          message: res?.message || 'Asset deleted successfully',
        });

        setDeleteModalOpen(false);
        setSelectedAssetToDelete(null);
        setSelectedIndexToDelete(null);
      },
      onError: (err) => {
        displayNotification({
          variant: 'error',
          message: err || 'Error deleting asset',
        });
      },
    }
  );

  const { mutate: submitAsset, isLoading: isSubmitting } = useMutation(
    createAsset,
    {
      onSuccess: (e) => {
        queryClient.invalidateQueries([
          'applicant-assets',
          dealershipId,
          applicantId,
        ]);
        displayNotification({
          variant: 'success',
          message: e?.message || 'Asset created successfully',
        });
      },
      onError: (err) => {
        displayNotification({
          variant: 'error',
          message: err || 'Error creating asset',
        });
      },
    }
  );

  const handleSubmitAsset = (asset) => {
    const selectedAsset = assetMaster.find((item) => item.name === asset.type);

    if (!selectedAsset) return;

    const payload = {
      asset_id: selectedAsset.asset_id,
      asset_value: Number(asset.asset_value || 0),
      market_value: Number(asset.market_value || 0),
      ownership: asset.ownership,
      details: {
        ...asset.dynamicFields,
        asset_value: Number(asset.asset_value || 0),
        market_value: Number(asset.market_value || 0),
        ownership: asset.ownership,
      },
    };

    submitAsset({
      dealershipId,
      applicantId,
      payload,
    });
  };

  const confirmDeleteAsset = () => {
    if (!selectedAssetToDelete) return;

    handleDeleteAsset(selectedAssetToDelete, selectedIndexToDelete);
  };

  const handleReload = async () => {
    try {
      await refetchAssets(); 
      await refetchApplicantAssets();
      await refetchLiabilities();
    } catch (err) {
      displayNotification({
        variant: 'error',
        message: 'Failed to refresh data',
      });
    }
  };

  return (
    <Container size="xl" py="lg">
      {assetsLoading || applicantAssetsLoading || liabilitiesLoading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '70vh',
          }}
        >
          <Loader size="lg" />
        </div>
      ) : (
        <>
          <Group justify="flex-end" mb="md">
            <ActionIcon
              variant="light"
              color="blue"
              size="lg"
              onClick={handleReload}
              loading={assetsFetching || applicantAssetsFetching || liabilitiesFetching}
            >
              <IconRefresh size={18} />
            </ActionIcon>
          </Group>
          <SimpleGrid cols={{ base: 1, md: 3 }} mb="xl">
            <Paper withBorder radius="lg" p="lg">
              <Text c="dimmed">Total Assets</Text>
              <Text fz="lg" fw={700} c="green">
                ₹{totalAssets.toLocaleString('en-IN')}
              </Text>
            </Paper>

            <Paper withBorder radius="lg" p="lg">
              <Text c="dimmed">Total Liabilities</Text>
              <Text fz="lg" fw={700} size="lg" c="red">
                ₹{totalLiabilities.toLocaleString('en-IN')}
              </Text>
            </Paper>

            <Paper
              withBorder
              radius="lg"
              p="lg"
              style={{ borderColor: '#40c057' }}
            >
              <Text c="dimmed">Net Worth</Text>
              <Text fz="lg" fw={700} size="lg" c="green">
                ₹{netWorth.toLocaleString('en-IN')}
              </Text>
            </Paper>
          </SimpleGrid>

          {/* -------------------- Assets Section -------------------- */}
          <Paper withBorder radius="lg" p="lg" mb="xl">
            <Group justify="space-between" mb="md">
              <Group>
                <ThemeIcon color="green" variant="light">
                  <IconWallet size={18} />
                </ThemeIcon>
                <Title order={4}>Assets</Title>
              </Group>

              <Button leftSection={<IconPlus size={16} />} onClick={addAsset}>
                Add Asset
              </Button>
            </Group>

            {/* <Divider mb="md" /> */}

            <Stack>
              {assets.map((asset, index) => {
                const selectedAsset = assetMaster.find(
                  (item) => item.name === asset.type
                );

                const dynamicFields = selectedAsset?.details
                  ? JSON.parse(selectedAsset.details)
                  : [];

                return (
                  <Paper key={index} withBorder p="md" radius="md">
                    <SimpleGrid cols={3} spacing="md">
                      {/* 1️⃣ Asset Type */}
                      <Select
                        label="Asset Type"
                        size="sm"
                        disabled={asset.isFromAPI}
                        placeholder="Select type"
                        data={assetMaster.map((item) => ({
                          value: item.name,
                          label: item.name,
                        }))}
                        value={asset.type}
                        onChange={(value) => {
                          const updated = [...assets];
                          updated[index].type = value;
                          updated[index].dynamicFields = {};
                          setAssets(updated);
                        }}
                      />

                      {/* 2️⃣ Dynamic Fields */}
                      {asset.type &&
                        dynamicFields.map((field) => (
                          <TextInput
                            key={field.key}
                            disabled={asset.isFromAPI}
                            label={field.label}
                            size="sm"
                            type={field.type === 'number' ? 'number' : 'text'}
                            value={asset.dynamicFields?.[field.key] || ''}
                            onChange={(e) => {
                              const updated = [...assets];
                              updated[index].dynamicFields = {
                                ...updated[index].dynamicFields,
                                [field.key]: e.target.value,
                              };
                              setAssets(updated);
                            }}
                          />
                        ))}

                      {/* Asset Value */}
                      <TextInput
                        label="Asset Value"
                        size="sm"
                        value={formatToINR(asset.asset_value)}
                        disabled={asset.isFromAPI}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/,/g, '');
                          const updated = [...assets];
                          updated[index].asset_value = rawValue;
                          setAssets(updated);
                        }}
                      />

                      {/* Market Value */}
                      <TextInput
                        label="Market Value"
                        size="sm"
                        value={formatToINR(asset.market_value)}
                        disabled={asset.isFromAPI}
                        onChange={(e) => {
                          const rawValue = e.target.value.replace(/,/g, '');
                          const updated = [...assets];
                          updated[index].market_value = rawValue;
                          setAssets(updated);
                        }}
                      />

                      {/* Ownership Select */}
                      <Select
                        label="Ownership"
                        size="sm"
                        placeholder="Choose ownership"
                        clearable
                        disabled={asset.isFromAPI}
                        value={asset.ownership}
                        data={[
                          { value: 'Self owned', label: 'Self owned' },
                          { value: 'Family owned', label: 'Family owned' },
                          { value: 'Partnership', label: 'Partnership' },
                          ...(asset.type !== 'Gold'
                            ? [{ value: 'Leased', label: 'Leased' }]
                            : []),
                        ]}
                        onChange={(value) => {
                          const updated = [...assets];
                          updated[index].ownership = value;
                          setAssets(updated);
                        }}
                      />
                    </SimpleGrid>

                    {/* Delete Icon */}
                    <Group justify="flex-end" mt="sm" gap="xs">
                      {/* Submit Button */}
                      {!asset.isFromAPI && (
                        <ActionIcon
                          color="green"
                          variant="light"
                          disabled={
                            isSubmitting ||
                            !asset.type ||
                            !asset.ownership ||
                            !asset.asset_value ||
                            !asset.market_value
                          }
                          loading={isSubmitting}
                          onClick={() => handleSubmitAsset(asset)}
                        >
                          <IconCheck size={16} />
                        </ActionIcon>
                      )}

                      {/* Delete Button */}
                      <ActionIcon
                        color="red"
                        variant="light"
                        onClick={() => {
                          if (asset.isFromAPI) {
                            setSelectedAssetToDelete(asset);
                            setSelectedIndexToDelete(index);
                            setDeleteModalOpen(true);
                          } else {
                            setAssets((prev) => prev.filter((_, i) => i !== index));
                          }
                        }}
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  </Paper>
                );
              })}
            </Stack>
          </Paper>

          {/* -------------------- Liabilities Section -------------------- */}
          <Paper withBorder radius="lg" p="lg">
            <Group justify="space-between" mb="md">
              <Group>
                <ThemeIcon color="red" variant="light">
                  <IconTrendingDown size={18} />
                </ThemeIcon>
                <Title order={4}>Liabilities</Title>
              </Group>
            </Group>

            {/* Header Row */}
            <SimpleGrid cols={5} spacing="md" mb="xs">
              <Text fw={600} ta={'center'}>
                Loan Type
              </Text>
              <Text fw={600} ta={'center'}>
                Bank Name
              </Text>
              <Text fw={600} ta={'center'}>
                Loan Amount (₹)
              </Text>
              <Text fw={600} ta={'center'}>
                Outstanding (₹)
              </Text>
              <Text fw={600} ta={'center'}>
                EMI (₹)
              </Text>
            </SimpleGrid>

            <Divider mb="md" />

            {/* Data Rows */}
            <Stack spacing="sm">
              {liabilities.map((liability, index) => (
                <SimpleGrid key={index} cols={5} spacing="md">
                  <TextInput
                    value={liability.type}
                    readOnly
                    size="sm"
                    variant="filled"
                  />

                  <TextInput
                    value={liability.bankName}
                    readOnly
                    size="sm"
                    variant="filled"
                  />

                  <TextInput
                    value={liability.loanAmount?.toLocaleString('en-IN')}
                    readOnly
                    size="sm"
                    variant="filled"
                  />

                  <TextInput
                    value={liability.outstanding?.toLocaleString('en-IN')}
                    readOnly
                    size="sm"
                    variant="filled"
                  />

                  <TextInput
                    value={liability.emi?.toLocaleString('en-IN')}
                    readOnly
                    size="sm"
                    variant="filled"
                  />
                </SimpleGrid>
              ))}
            </Stack>
          </Paper>
        </>
      )}

      <Modal
        open={deleteModalOpen}
        close={() => setDeleteModalOpen(false)}
        title="Delete Asset"
        centered
      >
        <Stack>
          <Text>Are you sure you want to delete this asset?</Text>

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>

            <Button
              color="red"
              loading={isDeleting}
              onClick={confirmDeleteAsset}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Container>
  );
};

export default AssetsAndLiability;
