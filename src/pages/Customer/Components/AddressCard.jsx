import React, { useState } from 'react';
import {
  Card,
  Grid,
  Text,
  Checkbox,
  Button,
  Group,
  Badge,
  TextInput,
  Stack,
  Divider
} from '@mantine/core';
import { IconMapPin, IconEdit, IconCheck, IconTrash } from '@tabler/icons-react';

function AddressCard({
  address,
  index,
  type,
  source,
  isSelected,
  onSelect,
  onEdit,
  isEditable = false,
  onDelete
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAddress, setEditedAddress] = useState(address);

  const handleEdit = () => {
    if (isEditing) {

      if (!editedAddress.address || editedAddress.address.trim() === "") {
        alert("Address cannot be empty");
        return;
      }

      onEdit(editedAddress);
    }

    setIsEditing(!isEditing);
  };

  const handleChange = (field, value) => {
    setEditedAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getSourceColor = () => {
    if (source === 'Mobile') return 'blue';
    if (source === 'PAN') return 'green';
    if (source === 'Manual') return 'orange';
    return 'gray';
  };

  return (
    <Card withBorder shadow="sm" p="md" radius="md" mb="sm">
      <Group justify="space-between" mb="xs">
        <Group>
          <IconMapPin size={20} color="blue" />
          <Text fw={600}>Address {index + 1}</Text>
          {/* <Badge color={getSourceColor()}>
            {source || 'Address'}
          </Badge> */}
        </Group>

        <Group>

          {/* EDIT BUTTON */}
          {isEditable && !isEditing && (
            <Button
              variant="subtle"
              size="xs"
              onClick={() => setIsEditing(true)}
              leftSection={<IconEdit size={16} />}
            >
              Edit
            </Button>
          )}

          {isEditable && isEditing && (
            <>
              <Button
                variant="light"
                color="green"
                size="xs"
                onClick={handleEdit}
                leftSection={<IconCheck size={16} />}
              >
                Save
              </Button>

              <Button
                variant="light"
                color="gray"
                size="xs"
                onClick={() => {
                  setEditedAddress(address); // reset
                  setIsEditing(false);       // cancel edit
                }}
              >
                Cancel
              </Button>
            </>
          )}

          {/* DELETE BUTTON ONLY MANUAL */}
          {isEditable && !isEditing && (
            <Button
              variant="subtle"
              color="red"
              size="xs"
              onClick={onDelete}
              leftSection={<IconTrash size={16} />}
            >
              Remove
            </Button>
          )}

        </Group>
      </Group>

      {isEditing ? (
        <Stack>
          <TextInput
            label="Address"
            value={editedAddress.address || ''}
            onChange={(e) => handleChange('address', e.target.value)}
          />
          <Grid>
            <Grid.Col span={4}>
              <TextInput
                label="City"
                value={editedAddress.city || ''}
                onChange={(e) => handleChange('city', e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="State"
                value={editedAddress.state || ''}
                onChange={(e) => handleChange('state', e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="Postal Code"
                value={editedAddress.postal || ''}
                onChange={(e) => handleChange('postal', e.target.value)}
                inputMode='numeric'

              />
            </Grid.Col>
            <Grid.Col span={6}>
              <TextInput
                label="Country"
                value={editedAddress.country || 'India'}
                onChange={(e) => handleChange('country', e.target.value)}
              />
            </Grid.Col>
          </Grid>
        </Stack>
      ) : (
        <Stack>
          <Text size="sm">{address.address || '-'}</Text>
          <Grid>
            <Grid.Col span={4}>
              <Text size="xs" c="dimmed">City</Text>
              <Text size="sm">{address.city || '-'}</Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Text size="xs" c="dimmed">State</Text>
              <Text size="sm">{address.state || '-'}</Text>
            </Grid.Col>
            <Grid.Col span={4}>
              <Text size="xs" c="dimmed">Postal Code</Text>
              <Text size="sm">{address.postal || '-'}</Text>
            </Grid.Col>
          </Grid>
          {address.reported_date && (
            <Text size="xs" c="dimmed">
              Reported: {new Date(address.reported_date).toLocaleDateString()}
            </Text>
          )}
        </Stack>
      )}

      <Divider my="sm" />

      <Group justify="flex-end" mt="sm">
        <Checkbox
          label="Permanent Address"
          checked={isSelected?.permanent}
          onChange={() => onSelect('permanent')}
          color="green"
        />
        <Checkbox
          label="Communication Address"
          checked={isSelected?.communication}
          onChange={() => onSelect('communication')}
          color="blue"
        />
      </Group>
    </Card>
  );
}

export default AddressCard;