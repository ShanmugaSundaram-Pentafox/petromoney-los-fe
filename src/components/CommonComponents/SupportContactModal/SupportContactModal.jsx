import { Button, Flex, Modal, Text } from "@mantine/core";
import React from 'react';

const SupportContactModal = ({
date,
opened,
onClose,
}) => {
    return (<Modal opened={opened} onClose={onClose} title="Filter not applicable">
        <Text>The date range exceeds the 90 days limit. For additional data, please contact support.</Text>
        <Flex justify="flex-end" mt="md">
            <Button onClick={onClose}
                variant='outline'
            >
                Close
            </Button>
        </Flex>
    </Modal>
    );
}
export default SupportContactModal;