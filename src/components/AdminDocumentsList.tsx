import {
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  Link as ChakraLink,
  Link,
  Spinner,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import router from 'next/router';
import { useState } from 'react';
import { IoSearch } from 'react-icons/io5';
import { RiAddLine } from 'react-icons/ri';
import { useDocuments } from '../hooks/useDocuments';
import { Pagination } from './Pagination';

export function AdminDocumentsList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, error } = useDocuments(page);

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  });

  function onView(id: string) {
    router.push({ pathname: '/view', query: { id } });
  }

  return (
    <Flex
      width="100%"
      my="1.5rem"
      maxW="98%"
      w="1200px"
      mx="auto"
      px={['4', '6']}
      direction="column"
    >
      <Flex justify="space-between" mb="8">
        <Heading size="lg">
          Documentos
          {!isLoading && isFetching && (
            <Spinner size="sm" color="gray.500" ml="4" />
          )}
        </Heading>
        <Link href="/upload" passHref>
          <Button
            as="a"
            size="sm"
            fontSize="sm"
            colorScheme="blue"
            leftIcon={<Icon as={RiAddLine} />}
          >
            Adicionar
          </Button>
        </Link>
      </Flex>
      {isLoading ? (
        <Flex justify="center">
          <Spinner />
        </Flex>
      ) : error ? (
        <Flex justify="center">Falha ao obter dados.</Flex>
      ) : (
        <>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Documento</Th>
                {isWideVersion && <Th>Tipo</Th>}
                {isWideVersion && <Th>Carga Horária</Th>}
                <Th>Status</Th>
                {isWideVersion && <Th>Aluno</Th>}
                {isWideVersion && <Th>Criado em</Th>}
                <Th isNumeric></Th>
              </Tr>
            </Thead>
            <Tbody>
              {data?.documents.map((document) => (
                <Tr key={document.id}>
                  <Td>
                    <ChakraLink href={document.pdf} target="_blank">
                      {document.description}
                    </ChakraLink>
                  </Td>
                  {isWideVersion && <Td>{document.type}</Td>}
                  {isWideVersion && <Td>{document.hours}h</Td>}
                  {document.status === 0 && (
                    <Td>
                      <Tag variant="subtle" minW="5.2rem">
                        <Text mx="auto">Pendente</Text>
                      </Tag>
                    </Td>
                  )}
                  {document.status === 1 && (
                    <Td>
                      <Tag variant="subtle" colorScheme="green" minW="5.2rem">
                        <Text mx="auto">Aprovado</Text>
                      </Tag>
                    </Td>
                  )}
                  {document.status === 2 && (
                    <Td>
                      <Tag variant="subtle" colorScheme="red" minW="5.2rem">
                        <Text mx="auto">Reprovado</Text>
                      </Tag>
                    </Td>
                  )}
                  {isWideVersion && <Td>{document.user.name}</Td>}
                  {isWideVersion && (
                    <Td>
                      {dayjs(document.createdAt).format('DD/MM/YYYY HH:mm')}
                    </Td>
                  )}
                  <Td isNumeric>
                    {isWideVersion ? (
                      <Button
                        colorScheme="gray"
                        onClick={() => {
                          onView(document.id);
                        }}
                        size="sm"
                      >
                        Analisar
                      </Button>
                    ) : (
                      <IconButton
                        icon={<Icon as={IoSearch} fontSize="xl" />}
                        onClick={() => {
                          onView(document.id);
                        }}
                        aria-label="Visualizar"
                        colorScheme="gray"
                        size="sm"
                      />
                    )}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Pagination
            totalCountOfRegisters={data?.totalCount || 0}
            currentPage={page}
            onPageChange={setPage}
          />
        </>
      )}
    </Flex>
  );
}
