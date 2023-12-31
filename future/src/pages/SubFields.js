import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardHeader, CardBody, CardFooter, Spacer } from '@chakra-ui/react';
import { Box, Heading, Text, Button, Image, Flex, Divider, Table, Thead, Tbody, Tr, Th, Td, Select } from '@chakra-ui/react';
import FloatingBookmark from '../components/FloatingBookMark';
import FloatingNotes from '../components/FloatingNotes';
import YouTube from 'react-youtube';

export default function SubFields() {
    const { major, subfield } = useParams();
    const [subFieldsData, setsubFieldsData] = useState(null);
    const [selectedState, setSelectedState] = useState(''); // State variable for the filter

    const capMajor = major.charAt(0).toUpperCase() + major.slice(1);
    const capSubField = subfield.charAt(0).toUpperCase() + subfield.slice(1);


    useEffect(() => {
        fetch(`http://localhost:8082/api/career/${capMajor}/${capSubField}`)
            .then((response) => response.json())
            .then((data) => {
                setsubFieldsData(data);
                console.log(data.video);
            })
            .catch((error) => {
                console.error('Error:', error);
                setsubFieldsData(null);
            });
    }, []);

    if (!subFieldsData) {
        return <div>Loading...</div>;
    }

    const uniqueStatesSet = new Set();
    subFieldsData.colleges.forEach((college) => uniqueStatesSet.add(college.state));
    const uniqueStates = Array.from(uniqueStatesSet);

    // Filter colleges based on selected state
    const filteredColleges = selectedState
        ? subFieldsData.colleges.filter((college) => college.state === selectedState)
        : subFieldsData.colleges;
    return (
        <Box p={'2'} m={'5'} >
            <Card align="center">
                <CardHeader>
                    <Flex>
                        <Heading size='lg' p="7">Deep dive into {subFieldsData.name}</Heading>
                        <Spacer />
                        <Image height="100px" src={subFieldsData.image} alt="Career Image" />
                        <FloatingNotes major={major} subfield={subfield} />
                    </Flex>

                </CardHeader>
                <CardBody align='center'>
                    <Box>
                        <Text fontSize='xl' align='center' p={'5'}>{subFieldsData.description}</Text>
                    </Box>
                    <Box>
                        <Box>
                            <Flex direction="row" align="center" >
                                <Heading size='md' p="5">Scope</Heading>
                                <Image height="50px" src={"https://cdn-icons-png.flaticon.com/512/60/60481.png"} alt="Career Image" />
                            </Flex>
                        </Box>
                        <Text fontSize='xl' align='left' p={'5'}>{subFieldsData.scope}</Text>
                    </Box>
                    <Box p={'2'} m={'5'}>
                        <Box>
                            <Flex direction="row" align="center">
                                <Heading size="md" p={'3'} align='left'>Career Opportunities</Heading>
                                <Image height="50px" src={subFieldsData.careerOpportunities[0].image} alt="Career Image" />
                            </Flex>
                        </Box>
                        <Divider />
                        <Box p={'5'}>
                            <Table variant="striped" colorScheme="gray">
                                <Thead>
                                    <Tr>
                                        <Th>Title</Th>
                                        <Th>Description</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {subFieldsData.careerOpportunities.map((opportunity) => (
                                        <Tr key={opportunity.id}>
                                            <Td fontWeight={'bold'}>{opportunity.name}</Td>
                                            <Td fontStyle={"italic"}>{opportunity.description}</Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </Box>
                        <Box p={'5'}>
                            <Box>
                                <Flex direction="row" align="center">
                                    <Heading size="md" align='left' p={'2'}>Colleges Offering this as a course</Heading>
                                    <Image height="50px" src={"https://cdn-icons-png.flaticon.com/512/5351/5351063.png"} alt="Career Image" />
                                </Flex>
                                <Select
                                    value={selectedState}
                                    onChange={(e) => setSelectedState(e.target.value)}
                                    placeholder="Filter by State"
                                    w="200px"

                                    mb="3"
                                >
                                    <option value="">All States</option>
                                    {uniqueStates.map((state) => (
                                        <option key={state} value={state}>
                                            {state}
                                        </option>
                                    ))}
                                </Select>
                            </Box>

                            <Divider />
                            <Box>
                                <Table variant="striped" colorScheme="gray">
                                    <Thead>
                                        <Tr>
                                            <Th>Name</Th>
                                            <Th>City</Th>
                                            <Th>State</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {filteredColleges.map((college) => (
                                            <Tr key={college.id}>
                                                <Td>{college.name}</Td>
                                                <Td>{college.city}</Td>
                                                <Td>{college.state}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </Box>
                        </Box>
                    </Box>

                </CardBody>
                <CardFooter>
                    <Heading size='md' p={'2'}>Some interesting videos</Heading>
                    {subFieldsData.video.map((video) => (
                        console.log(video),
                        <Box key={video} p={5}>
                            <YouTube
                                videoId={video}
                                opts={{
                                    height: '315',
                                    width: '560',
                                    playerVars: {
                                        autoplay: 0, // Set to 1 for autoplay
                                        controls: 1,
                                        rel: 0,
                                    },

                                }}
                            />
                        </Box>
                    ))}
                </CardFooter>
            </Card>
            <FloatingBookmark major={major} subfield={subfield} />



        </Box>
    );
}
