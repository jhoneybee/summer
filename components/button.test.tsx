/**
 *  TODO 任务完成进度
 * 
 *  - [x] test block 属性
 *  - [x] test disabled 属性
 *  - [x] test href 属性
 *  - [ ] test type 属性
 *  - [ ] test onClick 事件
 */
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';

import Button from './button';

test('test block', async () => {
    render(
        <div
            style={{
                width: 200
            }}
        >
            <Button
                block
                role='button'
            >
                测试按钮
            </Button>
        </div>
    );

    expect(await screen.findByRole('button')).toMatchSnapshot();
});

test('test disabled', async () => {
    render(
        <Button
            disabled
            role='button'
        >
            测试按钮
        </Button>
    );
    expect(await screen.findByRole('button')).toMatchSnapshot();
});

test('test href[_self]', async () => {
    render(
        <Button
            href="https://www.google.com"
            role='button'
        >
            测试按钮
        </Button>
    );
    expect(await screen.findByRole('button')).toMatchSnapshot();
});

test('test href[_blank]', async () => {
    render(
        <Button
            href="_blank->https://www.google.com"
            role='button'
        >
            测试按钮
        </Button>
    );
    expect(await screen.findByRole('button')).toMatchSnapshot();
});

test('test href[_parent]', async () => {
    render(
        <Button
            href="_blank->https://www.google.com"
            role='button'
        >
            测试按钮
        </Button>
    );
    expect(await screen.findByRole('button')).toMatchSnapshot();
});

test('test href[_top]', async () => {
    render(
        <Button
            href="_blank->https://www.google.com"
            role='button'
        >
            测试按钮
        </Button>
    );
    expect(await screen.findByRole('button')).toMatchSnapshot();
});

test('test type[primary]', async () => {
    render(
        <Button
            type='primary'
            role='button'
        >
            测试按钮
        </Button>
    );
    expect(await screen.findByRole('button')).toMatchSnapshot();
});

test('test type[text]', async () => {
    render(
        <Button
            type='text'
            role='button'
        >
            测试按钮
        </Button>
    );
    expect(await screen.findByRole('button')).toMatchSnapshot();
});

test('test type[text]', async () => {
    render(
        <Button
            type='text'
            role='button'
        >
            测试按钮
        </Button>
    );
    expect(await screen.findByRole('button')).toMatchSnapshot();
});

test('test danger', async () => {
    render(
        <Button
            danger
            role='button'
        >
            测试按钮
        </Button>
    );
    expect(await screen.findByRole('button')).toMatchSnapshot();
});

test('test danger type[text]', async () => {
    render(
        <Button
            danger
            type='text'
            role='button'
        >
            测试按钮
        </Button>
    );
    expect(await screen.findByRole('button')).toMatchSnapshot();
});


test('test onClick', async () => {
    const OnClickButton = () => {
        const [text, setText] = React.useState('测试按钮')
        return (
            <Button
            danger
            type='text'
            role='button'
            onClick={() => {
                setText('改变的按钮');
            }}
            >
                {text}
            </Button>
        )
        
    }
    const { findByRole } = render(
        <OnClickButton />
    );

    const button = await findByRole('button');
    fireEvent.click(button)
    expect(button).toMatchSnapshot();
});

test('test onClick async', async () => {
    await act(async () => {
        const OnClickButton = () => {
            const [text, setText] = React.useState('测试按钮')
            return (
                <Button
                danger
                type='text'
                role='button'
                onClick={async () => {
                    setText('改变的按钮');
                }}
                >
                    {text}
                </Button>
            )
            
        }
        const { findByRole } = render(
            <OnClickButton />
        );

        const button = await findByRole('button');
        fireEvent.click(button)
        expect(button).toMatchSnapshot();
    })
});

test('test onClick none', async () => {
    const OnClickButton = () => {
        return (
            <Button
            danger
            type='text'
            role='button'
            >
                按钮信息
            </Button>
        )
        
    }
    const { findByRole } = render(
        <OnClickButton />
    );

    const button = await findByRole('button');
    fireEvent.click(button)
    expect(button).toMatchSnapshot();
});


