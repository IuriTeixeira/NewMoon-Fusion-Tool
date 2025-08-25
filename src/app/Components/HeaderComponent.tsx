import { Button, Center, Container, Group, Image, Stack, Text } from '@mantine/core';
import classes from './HeaderComponent.module.css';
import Link from 'next/link';

export default function HeaderComponent() {
    return (
        <header className={classes.header}>
            <Container size="xl" className={classes.inner}>
                <Stack gap={5}>
                    <Center>
                        <Link href={'/'}>
                            <Center mr='sm'>
                                <Image src={`/NewMoonLogo.png`} alt='New Moon Logo' w={48} h={48} mr={5}/> <h1>New Moon Fusion Tool</h1>
                            </Center>
                        </Link>
                        <Text c={'dimmed'} fw={500}>by Glorienn</Text>
                    </Center>
                    <Group gap={'xs'} align='center' justify='center'>
                        <Link href={'/'}>
                            <Button size={'compact-md'}>
                                Fusions
                            </Button>
                        </Link>
                        <Link href={'/contract'}>
                            <Button size={'compact-md'}>
                                Demon Locations
                            </Button>
                        </Link>
                        <Link href={'/about'}>
                            <Button size={'compact-md'}>
                                About
                            </Button>
                        </Link>
                    </Group>
                </Stack>
            </Container>
        </header>
    )
}