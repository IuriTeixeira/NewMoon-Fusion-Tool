import { Container, Flex, Image, Text } from '@mantine/core';
import classes from './HeaderComponent.module.css';
import Link from 'next/link';

export default function HeaderComponent() {
    return (
        <header className={classes.header}>
            <Container size="md" className={classes.inner}>
                <Link href={'/'}>
                    <Flex align={'center'} justify={'flex-start'} gap={'xs'}>
                        <Image src={`/NewMoonLogo.png`} alt='New Moon Logo' w={48} h={48} /> <h1>New Moon Fusion Tool</h1>
                    </Flex>
                </Link>
                <Text c={'dimmed'} fw={500}>by Glorienn</Text>
            </Container>
        </header>
    )
}