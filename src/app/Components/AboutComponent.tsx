import { Anchor, Flex, Text, Title } from "@mantine/core";

export default function AboutComponent() {
    return (
        <Flex direction={'column'} align={'flex-start'} justify={'flex-start'} m={'lg'} w={'80%'}>
            <Title mb={'xs'}>About</Title>
            <Text mb={'xs'} ta={'justify'}>This is a simple fusion tool for the New Moon server of the <Text span fs="italic">Shin Megami Tensei: IMAGINE Online</Text> MMO.</Text>
            <Text mb={'xs'} ta={'justify'}>I made this mostly because the regular <Anchor href="https://aqiu384.github.io/megaten-fusion-tool/smtim/demons">Imagine fusion tool</Anchor> is made for a vanilla server and doesn&apost include the new demons from New Moon, and it uses localized names that are not reflected in-game, which makes working with it a bit annoying in some cases. Additionally, I noticed some fusion ranges were wrong in that tool, which I have corrected on this.</Text>
            <Text mb={'xs'} ta={'justify'}>This was made from scratch, I have not used any code from aqiu384&aposs tool. All the information used to make this came from the <Anchor href="https://wiki.megatenonline.ru/">imagine wiki</Anchor>, myself checking things in-game, and some people helping out with things I couldn&apost check myself.</Text>
            <Text mb={'xs'} ta={'justify'}>The purpose of this tool is simply to facilitate fusions. As such, I haven&apost included any information that is not related to fusions, such as stats, affinities, skills, etc.</Text>
            <Text mb={'sm'} ta={'justify'}>I do not plan on implementing regular triple fusions on this tool. This decision is final. You should not use those unless you&aposre fusing a demon that requires it in the first place, in which case you don&apost need a fusion tool. Honestly, the entire system is a mess and I&aposm not even sure if it works properly as intended.</Text>
            <Title mb={'xs'}>Contact Info</Title>
            <Text mb={'xs'} ta={'justify'}>If you have any suggestions or comments, or notice any bugs, feel free to tell me over at the New Moon discord, where I use the name Glorienn. There&aposs a thread for this tool under the #resources channel.</Text>
        </Flex>
    )
}